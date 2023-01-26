import { Request, Response, Router } from "express"
import { Service } from "typedi"
import { StatusCodes } from "http-status-codes"
import { CoreService } from "@app/services/core.service"
import { CacheService } from "@app/services/cache.service"

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
        return res.json(
          (await redis.json.get("core:state")) ||
            (await this.cacheService.refreshState())
        )
      } catch (e) {
        console.error(e)
        return res.sendStatus(500)
      }
    })
  }
}
