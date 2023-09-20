import { Authorized, Ctx, FieldResolver, Query, Resolver } from "type-graphql"
import { User } from "@app/models/user.model"
import { Service } from "typedi"
import { Domain } from "@app/models/domain.model"
import { Plan } from "@app/models/plan.model"
import { Context } from "@app/types/graphql/context"
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

@Resolver(CoreState)
@Service()
export class CoreResolver {
  constructor(
    private coreService: CoreService,
    private cacheService: CacheService
  ) {}

  @Query(() => CoreState)
  async coreState(@Ctx() ctx: Context): Promise<Partial<CoreState>> {
    if (!config.finishedSetup) {
      let step = await this.setupStep(ctx)
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
      uptime: Math.round(process.uptime()),
      uptimeSys: Math.round(os.uptime()),
      commitVersion: process.env.TPU_COMMIT_HASH || "unknown",
      connection: {
        ip: ctx.ip,
        whitelist: false
      }
    } as Partial<CoreState>
  }

  @Query(() => Number)
  async setupStep(@Ctx() ctx: Context) {
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
  async experiments(@Ctx() ctx: Context) {
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
