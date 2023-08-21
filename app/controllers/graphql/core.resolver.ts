import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver
} from "type-graphql"
import { UserUtilsService } from "@app/services/userUtils.service"
import { User } from "@app/models/user.model"
import { Service } from "typedi"
import { Session } from "@app/models/session.model"
import { Op } from "sequelize"
import { Experiment } from "@app/models/experiment.model"
import { Subscription } from "@app/models/subscription.model"
import { Domain } from "@app/models/domain.model"
import { Plan } from "@app/models/plan.model"
import { Theme } from "@app/models/theme.model"
import { Integration } from "@app/models/integration.model"
import { Badge } from "@app/models/badge.model"
import { Includeable } from "sequelize"
import { Context } from "@app/types/graphql/context"
import {
  LoginInput,
  LoginResponse,
  RegisterInput
} from "@app/classes/graphql/auth/login"
import { AuthService } from "@app/services/auth.service"
import Errors from "@app/lib/errors"
import blacklist from "@app/lib/word-blacklist.json"
import { InviteService } from "@app/services/invite.service"
import fs from "fs"
import path from "path"
import { CoreService } from "@app/services/core.service"
import { CoreState } from "@app/classes/graphql/core/core"
import cluster from "cluster"
import os from "os"
import { CacheService } from "@app/services/cache.service"
import { ExperimentType } from "@app/classes/graphql/core/experiments"
import { Weather } from "@app/classes/graphql/core/weather"
import { WeatherResponse } from "@app/interfaces/weather"
import { GraphQLError } from "graphql/error"

@Resolver(User)
@Service()
export class CoreResolver {
  constructor(
    private coreService: CoreService,
    private cacheService: CacheService
  ) {}

  @Query(() => CoreState)
  async coreState(@Ctx() ctx: Context): Promise<Partial<CoreState>> {
    if (!config.finishedSetup) {
      let step = await this.getSetupStep(ctx)
      return {
        finishedSetup: false,
        name: config.siteName,
        step,
        // Test if running inside default Docker environment
        dbHost: process.env.IS_DOCKER === "true" ? "mariadb" : "localhost",
        redisHost: process.env.IS_DOCKER === "true" ? "redis" : "localhost"
      } as Partial<CoreState>
    }
    return {
      ...((await redis.json.get("core:state")) ||
        (await this.cacheService.refreshState())),
      server: cluster.worker?.id
        ? `${os.hostname()?.toUpperCase()}#${cluster.worker?.id}`
        : os.hostname()?.toUpperCase(),
      finishedSetup: true,
      domain: global.domain,
      maintenance: config.maintenance,
      uptime: process.uptime(),
      uptimeSys: os.uptime(),
      commitVersion: process.env.TPU_COMMIT_HASH || "unknown"
    } as Partial<CoreState>
  }

  @Query(() => Number)
  async getSetupStep(@Ctx() ctx: Context) {
    try {
      if (
        await Domain.findOne({
          where: {
            id: 1
          }
        })
      ) {
        return 8
      }
      if (config.email.from !== "default@privateuploader.local") {
        return 6
      }
      if (await fs.existsSync(path.join(appRoot, "config", "tpu.json"))) {
        return 5
      }
      if (
        await User.findOne({
          where: {
            id: 1
          }
        })
      ) {
        return 4
      }
      if (
        await Plan.findOne({
          where: {
            id: 1
          }
        })
      ) {
        return 3
      }
      if (
        (await fs.existsSync(path.join(appRoot, "config", "config.json"))) &&
        (await User.findAll())
      ) {
        return 2
      }
      return 0
    } catch {
      return 0
    }
  }

  @Query(() => [ExperimentType])
  async getExperiments(@Ctx() ctx: Context) {
    if (!ctx.user?.id) {
      return this.coreService.getExperimentsV4(config.release === "dev", false)
    }
    return await this.coreService.getUserExperimentsV4(ctx.user.id)
  }

  @FieldResolver(() => Weather)
  @Query(() => Weather)
  @Authorized({
    scopes: [""]
  })
  async weather(@Ctx() ctx: Context) {
    const cached = await redis.get(`core:weather:${ctx.ip}`)
    let weather: WeatherResponse = {}
    try {
      if (cached) {
        weather = JSON.parse(cached)
        weather.cached = true
      }
    } catch {}
    if (!weather?.temp) {
      weather = await this.coreService.getWeather(ctx.ip)
    }
    if (weather.error) {
      throw new GraphQLError(
        "The weather service is not responding. Please try again later."
      )
    } else {
      if (!weather.cached)
        redis.set(`core:weather:${ctx.ip}`, JSON.stringify(weather), {
          EX: 300,
          NX: true
        })
      return weather
    }
  }
}
