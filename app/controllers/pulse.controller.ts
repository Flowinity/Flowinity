import { Response, NextFunction } from "express"
import { Service } from "typedi"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import Router from "express-promise-router"
import { PulseService } from "@app/services/pulse.service"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import { UserUtilsService } from "@app/services/userUtils.service"
import { InsightData } from "@app/models/insight.model"
@Service()
export class PulseController {
  router: any

  constructor(
    private readonly pulseService: PulseService,
    private readonly userService: UserUtilsService
  ) {
    this.configureRouter()
  }

  private async checkUser(user1: number, user2: string | undefined) {
    if (!user2) {
      return {
        id: user1,
        createdAt: null,
        public: false
      }
    }
    const user = await User.findOne({
      where: {
        username: user2
      }
    })
    if (!user) throw Errors.USER_NOT_FOUND
    if (user.id !== user1) {
      if (user.insights === "nobody") throw Errors.INSIGHTS_DISABLED
      const friendStatus = await this.userService.getFriendStatus(
        user1,
        user.id
      )
      if (user.insights === "friends" && friendStatus !== "accepted")
        throw Errors.INSIGHTS_DISABLED
      return {
        ...user.dataValues,
        public: true
      }
    } else {
      return {
        ...user.dataValues,
        public: false
      }
    }
  }

  private stripSensitiveData(data: InsightData) {
    data.uploads.words = null
    data.messages.topChats = null
    return data
  }

  private configureRouter(): void {
    this.router = Router()

    // INSIGHTS V2
    this.router.get(
      "/insights/v2/reports/:username?",
      auth("insights.view"),
      async (req: RequestAuth, res: Response) => {
        const user = await this.checkUser(req.user.id, req.params.username)
        const reports = await this.pulseService.getReports(user.id)
        res.json(reports)
      }
    )

    this.router.get(
      "/insights/v2/dynamic/:username?",
      auth("insights.view"),
      async (req: RequestAuth, res: Response) => {
        const user = await this.checkUser(req.user.id, req.params.username)
        let insights = await redis.json.get(`insightsV2:${user.id}`)
        if (insights)
          return res.json({
            data: user.public
              ? this.stripSensitiveData(insights.data)
              : insights,
            startDate: user.createdAt || req.user.createdAt,
            endDate: new Date().toISOString(),
            _redis: new Date().toISOString()
          })
        insights = await this.pulseService.generateInsights(user.id, "dynamic")
        return res.json({
          data: user.public ? this.stripSensitiveData(insights.data) : insights,
          startDate: user.createdAt || req.user.createdAt,
          endDate: new Date().toISOString(),
          _redis: new Date().toISOString()
        })
      }
    )

    this.router.get(
      "/insights/v2/:type/:username?",
      auth("insights.view"),
      async (req: RequestAuth, res: Response) => {
        const user = await this.checkUser(req.user.id, req.params.username)
        if (["weekly", "monthly", "yearly"].includes(req.params.type)) {
          console.log("latest report")
          const insights = await this.pulseService.getLatestReport(
            user.id,
            <"weekly" | "monthly" | "yearly">req.params.type
          )
          if (!insights) return res.json(null)
          insights.data = user.public
            ? this.stripSensitiveData(insights.data)
            : insights.data
          return res.json(insights)
        } else {
          const insights = await this.pulseService.getReport(
            user.id,
            parseInt(req.params.type)
          )
          if (!insights) return res.json(null)
          insights.data = user.public
            ? this.stripSensitiveData(insights.data)
            : insights.data
          return res.json(insights)
        }
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
