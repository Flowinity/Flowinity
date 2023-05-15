import { Get, JsonController, Req, Post, Body } from "routing-controllers"
import { Service } from "typedi"
import { Auth } from "@app/lib/auth"
import { User } from "@app/models/user.model"
import { CoreService } from "@app/services/core.service"
import { CacheService } from "@app/services/cache.service"
import cluster from "cluster"
import os from "os"
import { Request } from "express"
import { WeatherResponse } from "@app/interfaces/weather"
import Errors from "@app/lib/errors"
import fs from "fs"
import path from "path"
import { Plan } from "@app/models/plan.model"

@Service()
@JsonController("/core")
export class CoreControllerV3 {
  constructor(
    private readonly coreService: CoreService,
    private readonly cacheService: CacheService
  ) {}

  @Get("/experiments")
  async getExperiments(@Auth("user.view", false) user: User) {
    const dev = user ? user.administrator || user.moderator : false
    const gold = user ? user.plan.internalName === "GOLD" : false
    if (!user) return this.coreService.getExperiments(dev, gold)
    return await this.coreService.getUserExperiments(user.id, dev, gold)
  }

  @Get("")
  @Get("/state")
  async getCore(@Req() req: Request) {
    if (!config.finishedSetup) {
      let step = 0
      if (await fs.existsSync(path.join(appRoot, "config", "config.json"))) {
        step = 2
      }
      if (
        await Plan.findOne({
          where: {
            id: 1
          }
        })
      ) {
        step = 3
      }
      if (
        await User.findOne({
          where: {
            id: 1
          }
        })
      ) {
        step = 4
      }
      if (await fs.existsSync(path.join(appRoot, "config", "tpu.json"))) {
        step = 6
      }
      if (config.email.from !== "default@privateuploader.local") {
        step = 7
      }
      return {
        finishedSetup: false,
        name: config.siteName,
        step
      }
    }
    return {
      ...((await redis.json.get("core:state")) ||
        (await this.cacheService.refreshState())),
      server: cluster.worker?.id
        ? `${os.hostname()?.toUpperCase()}#${cluster.worker?.id}`
        : os.hostname()?.toUpperCase(),
      connection: {
        ip: req.ip,
        whitelist: whitelist.find((w) => w.ip === req.ip) || false
      },
      finishedSetup: true
    }
  }

  @Get("/weather")
  async getWeather(@Auth("user.view") user: User, @Req() req: Request) {
    const cached = await redis.get(`core:weather:${req.ip}`)
    let weather: WeatherResponse = {}
    try {
      if (cached) {
        weather = JSON.parse(cached)
        weather.cached = true
      }
    } catch {}
    if (!weather?.temp) {
      weather = await this.coreService.getWeather(req.ip)
    }
    if (weather.error) {
      throw Errors.WEATHER_NOT_RESPONDING
    } else {
      // redis cache for 5 minutes
      if (!weather.cached)
        redis.set(`core:weather:${req.ip}`, JSON.stringify(weather), {
          EX: 300,
          NX: true
        })
      return weather
    }
  }

  @Post("/report")
  async report(
    @Auth("user.view", false) user: User,
    @Req() req: Request,
    @Body()
    body: {
      tpuLink: string
      content: string
      email: string
    }
  ) {
    await this.coreService.report(
      req.body.tpuLink,
      req.body.content,
      req.body.email,
      req.ip,
      user?.id
    )
  }
}
