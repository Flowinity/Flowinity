import {Get, JsonController, Params} from "routing-controllers"
import {Service} from "typedi"
import {Auth} from "@app/lib/auth"
import {User} from "@app/models/user.model"
import {PulseService} from "@app/services/pulse.service"
import {UserUtilsService} from "@app/services/userUtils.service"
import Errors from "@app/lib/errors"
import {InsightData} from "@app/models/insight.model"
import {OpenAPI} from "routing-controllers-openapi"

@Service()
@JsonController("/pulse")
export class PulseControllerV3 {
  constructor(
    private readonly pulseService: PulseService,
    private readonly userService: UserUtilsService
  ) {
  }

  @Get("/insights/v2/reports/:username?")
  async getInsightReports(
    @Auth("insights.view") authUser: User,
    @Params() {username}: { username?: string }
  ) {
    const user = await this.checkUser(authUser.id, username)
    return await this.pulseService.getReports(user.id)
  }

  @Get("/insights/v2/dynamic/:username?")
  async getInsightsDynamic(
    @Auth("insights.view") authUser: User,
    @Params()
      {username}: { username?: string }
  ) {
    const user = await this.checkUser(authUser.id, username)
    let insights = await redis.json.get(`insightsV2:${user.id}`)
    if (insights && config.release !== "dev")
      return {
        ...insights,
        data: user.public
          ? this.stripSensitiveData(insights.data)
          : insights.data
      }
    insights = await this.pulseService.generateInsights(user.id, "dynamic")
    return {
      data: user.public ? this.stripSensitiveData(insights) : insights,
      startDate: user.createdAt || authUser.createdAt,
      endDate: new Date().toISOString(),
      _redis: new Date().toISOString()
    }
  }

  @Get("/insights/v2/:type/:username?")
  async getInsights(
    @Auth("insights.view") authUser: User,
    @Params()
      {
        type,
        username
      }: { type: "weekly" | "monthly" | "yearly" | number; username?: string }
  ) {
    const user = await this.checkUser(authUser.id, username)
    if (
      typeof type === "string" &&
      ["weekly", "monthly", "yearly"].includes(type)
    ) {
      const insights = await this.pulseService.getLatestReport(user.id, type)
      if (!insights) return null
      insights.data = user.public
        ? this.stripSensitiveData(insights.data)
        : insights.data
      return insights
    } else {
      const insights = await this.pulseService.getReport(
        user.id,
        parseInt(type.toString())
      )
      if (!insights) return null
      insights.data = user.public
        ? this.stripSensitiveData(insights.data)
        : insights.data
      return insights
    }
  }

  @OpenAPI({deprecated: true})
  @Get("/insights/leaderboard")
  async getLegacyInsightsLeaderboard(@Auth("insights.view") authUser: User) {
    return await this.pulseService.getCachedLeaderboard()
  }

  @OpenAPI({deprecated: true})
  @Get("/insights/:year/:id")
  @Get("/insights/:year")
  @Get("/insights")
  async getLegacyInsights(
    @Auth("insights.view") authUser: User,
    @Params()
      {id, year}: { id: string | "global"; year: string | number }
  ) {
    if (id !== "global") throw Errors.API_REMOVED_V2
    return await this.pulseService.getCachedInsights(
      id || authUser.id,
      year,
      id === "global",
      authUser.id
    )
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
    if (!data) return data
    data.uploads.words = null
    data.messages.topChats = null
    return data
  }
}
