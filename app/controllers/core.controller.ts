import { Request, Response, Router } from "express"
import { Service } from "typedi"
import { StatusCodes } from "http-status-codes"
import { CoreService } from "@app/services/core.service"
import config from "@app/config/tpu.json"

@Service()
export class CoreController {
  router: Router

  constructor(private readonly coreService: CoreService) {
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
    this.router.get("/experiments", async (req: Request, res: Response) => {
      // Send the request to the service and send the response
      try {
        const experiments = this.coreService.getExperiments()
        res.json(experiments)
      } catch (e) {
        console.error(e)
        res.sendStatus(StatusCodes.UNAUTHORIZED)
      }
    })

    /**
     * @swagger
     *
     * /api/v2/core:
     *   get:
     *     description: Return the website state, with statistics.
     *     tags:
     *       - CoreService
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     */
    this.router.get("/", async (req: Request, res: Response) => {
      try {
        const cache = req.app.get("cache")
        if (await cache.get("site-state")) {
          return res.json(await cache.get("site-state"))
        }
        const response = {
          name: "TPUv2",
          release: "dev",
          whitelabel: true,
          registrations: false,
          route: null,
          loading: false,
          matomoId: null,
          hostname: "localhost",
          hostnameWithProtocol: "http://localhost",
          devNotification: null,
          announcements: await this.coreService.getAnnouncements(),
          debug: true,
          enterprise: true,
          flowinityId: config.flowinityId,
          openRegistrations: false,
          stats: await this.coreService.getStats(),
          maintenance: config.maintenance
        }
        cache.set("site-state", response)
        return res.json(response)
      } catch (e) {
        console.error(e)
        return res.sendStatus(500)
      }
    })

    /**
     * @swagger
     *
     * /api/v2/core/stats:
     *   get:
     *     description: Return just the website stats. Has a cache of 30 minutes, compared to infinite of state.
     *     tags:
     *       - CoreService
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     */
    this.router.get("/stats", async (req: Request, res: Response) => {
      try {
        const cache = req.app.get("cache")
        if (await cache.get("stats")) {
          console.log("cache received")
          return res.json(await cache.get("stats"))
        }
        const stats = await this.coreService.getStats()
        cache.set("stats", stats, 1800)
        return res.json(stats)
      } catch (e) {
        console.error(e)
        return res.sendStatus(500)
      }
    })
  }
}
