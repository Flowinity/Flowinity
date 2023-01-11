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

    this.router.get("/", async (req: Request, res: Response) => {
      try {
        const cache = req.app.get("cache")
        if (await cache.get("site-state")) {
          console.log("cache received")
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
        console.log(response)
        cache.set("site-state", response)
        return res.json(response)
      } catch (e) {
        console.error(e)
        return res.sendStatus(500)
      }
    })
  }
}
