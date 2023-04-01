import { Response } from "express"
import { Service } from "typedi"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import Router from "express-promise-router"
import { PulseService } from "@app/services/pulse.service"

@Service()
export class PulseController {
  router: any

  constructor(private readonly pulseService: PulseService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    // INSIGHTS V2
    this.router.get(
      "/insights/v2/reports",
      auth("insights.view"),
      async (req: RequestAuth, res: Response) => {
        const reports = await this.pulseService.getReports(req.user.id)
        res.json(reports)
      }
    )

    this.router.get(
      "/insights/v2/:type",
      auth("insights.view"),
      async (req: RequestAuth, res: Response) => {
        const insights = await this.pulseService.getLatestReport(
          req.user.id,
          <"weekly" | "monthly" | "yearly">req.params.type
        )
        res.json(insights)
      }
    )

    // INSIGHTS V1
    this.router.get(
      "/insights/leaderboard",
      auth("*"),
      async (req: RequestAuth, res: Response) => {
        const leaderboard = await this.pulseService.getCachedLeaderboard()
        res.json(leaderboard)
      }
    )

    this.router.get(
      ["/insights/:year/:id", "/insights/:year", "/insights"],
      auth("*"),
      async (req: RequestAuth, res: Response) => {
        const insights = await this.pulseService.getCachedInsights(
          req.params.id || req.user.id,
          req.params.year,
          req.params.id === "global",
          req.user.id
        )
        res.json(insights)
      }
    )
  }
}
