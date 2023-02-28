import { Request, Response, Router } from "express"
import { Service } from "typedi"
import { StatusCodes } from "http-status-codes"
import { CoreService } from "@app/services/core.service"
import { CacheService } from "@app/services/cache.service"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import os from "os"
import cluster from "cluster"

interface WeatherResponse {
  temp?: number
  feels_like?: number
  temp_min?: number
  temp_max?: number
  pressure?: number
  humidity?: number
  wind_speed?: number
  wind_deg?: number
  clouds?: number
  visibility?: number
  error?: boolean
  cached?: boolean
}
@Service()
export class CoreController {
  router: Router

  constructor(
    private readonly coreService: CoreService,
    private readonly cacheService: CacheService
  ) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    /**
     * @swagger
     *
     * /api/v2/core/experiments:
     *   get:
     *     description: Return the current website experiment opt-in configuration.
     *     tags:
     *       - CoreService
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     */
    this.router.get(
      "/experiments",
      auth("user.view", true),
      async (req: RequestAuth, res: Response) => {
        try {
          const dev = req.user
            ? req.user.administrator || req.user.moderator
            : false
          if (!req.user) return res.json(this.coreService.getExperiments(dev))
          const experiments = await this.coreService.getUserExperiments(
            req.user.id,
            dev
          )
          return res.json(experiments)
        } catch (e) {
          console.error(e)
          return res.sendStatus(StatusCodes.UNAUTHORIZED)
        }
      }
    )

    /**
     * @swagger
     *
     * /api/v2/core:
     *   get:
     *     description: Return the website state, with statistics, refreshes every 10 minutes.
     *     tags:
     *       - CoreService
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     */
    this.router.get(["/", "/state"], async (req: Request, res: Response) => {
      try {
        return res.json({
          ...((await redis.json.get("core:state")) ||
            (await this.cacheService.refreshState())),
          server: cluster.worker?.id
            ? `${os.hostname()?.toUpperCase()}#${cluster.worker?.id}`
            : os.hostname()?.toUpperCase()
        })
      } catch (e) {
        console.error(e)
        return res.sendStatus(500)
      }
    })

    this.router.get(
      "/weather",
      auth("user.view"),
      async (req: RequestAuth, res: Response) => {
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
          return res.status(500).json(weather)
        } else {
          // redis cache for 5 minutes
          if (!weather.cached)
            redis.set(`core:weather:${req.ip}`, JSON.stringify(weather), {
              EX: 300,
              NX: true
            })
          return res.json(weather)
        }
      }
    )
  }
}
