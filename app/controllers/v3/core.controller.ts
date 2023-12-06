import { Body, Get, JsonController, Post, Req } from "routing-controllers"
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
import { Domain } from "@app/models/domain.model"

@Service()
@JsonController("/core")
// For legacy /api/v1/site/state
@JsonController("/site")
export class CoreControllerV3 {
  constructor(
    private readonly coreService: CoreService,
    private readonly cacheService: CacheService
  ) {}

  async getStep() {
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

  @Get("/experiments")
  async getExperiments(@Auth("user.view", false) user: User | null) {
    const dev = user ? user.administrator || user.moderator : false
    const gold = user ? user.plan.internalName === "GOLD" : false
    if (!user) return this.coreService.getExperiments(dev, gold)
    return await this.coreService.getUserExperiments(user.id, dev, gold)
  }

  @Get("")
  @Get("/state")
  async getCore(@Req() req: Request) {
    const apiVersion = req.path.startsWith("/api/v2") ? 2 : 3
    if (!config.finishedSetup) {
      let step = await this.getStep()
      return {
        finishedSetup: false,
        name: config.siteName,
        step,
        // Test if running inside default Docker environment
        dbHost: process.env.IS_DOCKER === "true" ? "mariadb" : "localhost",
        redisHost: process.env.IS_DOCKER === "true" ? "redis" : "localhost"
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
      finishedSetup: true,
      domain: global.domain,
      maintenance:
        apiVersion === 2 ? config.maintenance.enabled : config.maintenance
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
    if (weather?.temp === undefined && req.ip) {
      weather = await this.coreService.getWeather(req.ip)
    }
    if (weather?.error || !req.ip) {
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
      req.ip || "0.0.0.0",
      user?.id
    )
  }
}
