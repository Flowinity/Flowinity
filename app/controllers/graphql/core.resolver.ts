import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver
} from "type-graphql"
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
import { Experiment } from "@app/models/experiment.model"
import { SetExperimentInput } from "@app/classes/graphql/core/setExperiment"
import { GqlError } from "@app/lib/gqlErrors"
import { Authorization } from "@app/lib/graphql/AuthChecker"

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
        ...(await this.coreService.getState()),
        finishedSetup: false,
        name: config.siteName || "PrivateUploader",
        // Test if running inside default Docker environment
        server: cluster.worker?.id
          ? `${os.hostname()?.toUpperCase()}#${cluster.worker?.id}`
          : os.hostname()?.toUpperCase(),
        domain: "",
        maintenance: {
          enabled: false,
          message: "",
          statusPage: ""
        },
        uptime: Math.round(process.uptime()),
        uptimeSys: Math.round(os.uptime()),
        commitVersion: process.env.TPU_COMMIT_HASH || "unknown",
        connection: {
          ip: ctx.ip,
          whitelist: false
        },
        release: "prod",
        hostname: "privateuploader.com",
        hostnameWithProtocol: "https://privateuploader.com",
        announcements: [],
        stats: {
          users: 0,
          announcements: 0,
          usage: 0,
          collections: 0,
          collectionItems: 0,
          uploadGraph: await this.coreService.convertToGraph([]),
          messageGraph: await this.coreService.convertToGraph([]),
          pulseGraph: await this.coreService.convertToGraph([], "pulse"),
          uploads: 0,
          invites: 0,
          inviteMilestone: 0,
          pulse: 0,
          pulses: 0,
          docs: 0,
          messages: 0,
          chats: 0
        },
        registrations: true,
        officialInstance: config.officialInstance,
        hostnames: [],
        _redis: "0"
      } as Partial<CoreState>
    }
    if (!global.domain) {
      global.domain = await Domain.findOne({
        where: { id: 1 }
      }).then((domain: Domain | null) => {
        if (domain) return domain.domain
        else return undefined
      })
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

  @Query(() => Int)
  async setupStep(@Ctx() ctx: Context) {
    try {
      if (config.finishedSetup) return -1
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
        return 7
      }
      if (await fs.existsSync(path.join(appRoot, "config", "tpu.json"))) {
        return 6
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

  @Authorization({
    scopes: [],
    userOptional: true,
    emailOptional: true
  })
  @Query(() => [ExperimentType])
  async experiments(@Ctx() ctx: Context) {
    if (!ctx.user?.id) {
      return this.coreService.getExperimentsV4(config.release === "dev", false)
    }
    return await this.coreService.getUserExperimentsV4(
      ctx.user.id,
      config.release === "dev" ||
        ctx.user?.administrator ||
        ctx.user?.moderator,
      false
    )
  }

  @FieldResolver(() => Weather)
  @Query(() => Weather)
  @Authorization({
    scopes: [],
    userOptional: true,
    emailOptional: true
  })
  async weather(@Ctx() ctx: Context) {
    if (!config.finishedSetup)
      throw new GraphQLError(
        "The weather service is not responding. Please try again later.",
        {
          extensions: {
            code: "WEATHER_NOT_RESPONDING"
          }
        }
      )
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
        "The weather service is not responding. Please try again later.",
        {
          extensions: {
            code: "WEATHER_NOT_RESPONDING"
          }
        }
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

  @Mutation(() => Experiment)
  @Authorization({
    scopes: ["user.modify"],
    emailOptional: true
  })
  async setExperiment(
    @Ctx() ctx: Context,
    @Arg("input") input: SetExperimentInput
  ) {
    const validExperiments = ["NOTIFICATION_SOUND", "THEME", "PRIDE"]
    if (input.userId && !ctx.user?.administrator)
      throw new GqlError("NOT_ADMIN")
    if (!validExperiments.includes(input.key) && !ctx.user?.administrator)
      throw new GraphQLError(
        `The experiment specified "${input.key}" cannot be manually reassigned.`
      )
    const experiment = await Experiment.findOne({
      where: {
        userId: input.userId || ctx.user!!.id,
        key: input.key
      }
    })
    if (experiment) {
      await experiment.update({
        value: input.value
      })
      return experiment
    } else {
      return await Experiment.create({
        userId: input.userId || ctx.user!!.id,
        key: input.key,
        value: input.value
      })
    }
  }
}
