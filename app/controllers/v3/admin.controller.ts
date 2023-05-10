import {
  Get,
  JsonController,
  Req,
  Post,
  Body,
  All,
  UseBefore,
  ExpressMiddlewareInterface,
  Delete,
  Param,
  Patch,
  Res,
  Put,
  Middleware
} from "routing-controllers"
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
import { CacheType } from "@app/controllers/admin.controller"
import { AdminService } from "@app/services/admin.service"
import { UserUtilsService } from "@app/services/userUtils.service"
import { Response } from "express"
import { Badge } from "@app/models/badge.model"
import { Experiment } from "@app/models/experiment.model"
import { RequestAuth } from "@app/types/express"

@Service()
@Middleware({ type: "before" })
class HighLevel implements ExpressMiddlewareInterface {
  use(request: RequestAuth, response: Response, next: (err?: any) => any): any {
    if (!request.user || !request.user.administrator) throw Errors.ADMIN_ONLY
    next()
  }
}

@Service()
@Middleware({ type: "before" })
class LowLevel implements ExpressMiddlewareInterface {
  use(request: RequestAuth, response: Response, next: (err?: any) => any): any {
    if (
      !request.user ||
      !request.user?.administrator ||
      !request.user?.moderator
    )
      throw Errors.ADMIN_ONLY
    next()
  }
}

@Service()
@JsonController("/admin")
export class AdminControllerV3 {
  constructor(
    private readonly adminService: AdminService,
    private readonly cacheService: CacheService,
    private readonly userUtilsService: UserUtilsService,
    private readonly coreService: CoreService
  ) {}

  @UseBefore(LowLevel)
  @Get("/dashboard")
  async getDashboard(@Auth("*") user: User, @Req() req: Request) {
    return {}
  }

  @UseBefore(LowLevel)
  @Delete("/cache/:key")
  @Delete("/cache/:key/:uid")
  async deleteCache(
    @Auth("*") user: User,
    @Param("key") key: CacheType,
    @Param("uid") uid?: number
  ) {
    if (uid) {
      this.adminService.purgeUserCache(uid)
      return
    } else {
      this.adminService.purgeCache(key)
      return
    }
  }

  @UseBefore(LowLevel)
  @Get("/users")
  async getUsers(@Auth("*") user: User) {
    return await this.adminService.getUsers()
  }

  @UseBefore(LowLevel)
  @Get("/invites")
  async getInvites(@Auth("*") user: User) {
    return await this.adminService.getInvites()
  }

  @UseBefore(LowLevel)
  @Patch("/invites/:inviteKey")
  async updateInvite(
    @Auth("*") user: User,
    @Param("inviteKey") inviteKey: string,
    @Body()
    body: {
      type: "accepted" | "rejected"
    }
  ) {
    const invite = await this.adminService.actOnInvite(inviteKey, body.type)
    if (!invite) throw Errors.INVITE_NOT_FOUND
    this.cacheService.purgeInvite(inviteKey)
    if (body.type === "accepted") {
      this.adminService.sendEmail(
        {
          body: {
            intro: `Your friend ${invite.user.username} has invited you to join TPU.`,
            action: [
              {
                instructions: `TPU is a free invite-only image and file hosting service.`,
                button: {
                  color: "#0190ea", // Optional action button color
                  text: "Create your account",
                  link:
                    config.hostnameWithProtocol + "/invite/" + invite.inviteKey
                }
              },
              {
                instructions: "Want to learn more about the advantages of TPU?",
                button: {
                  color: "#0190ea", // Optional action button color
                  text: "Learn more",
                  link: "https://images.flowinity.com"
                }
              }
            ],
            outro:
              "If you do not intend to create an account, you can ignore this email."
          }
        },
        invite.email,
        `Your friend ${invite.user.username} has invited you to join TPU`
      )
      return
    }
    this.adminService.sendEmail(
      {
        body: {
          intro: `Your invite request has been ${body.type}.`,
          action: [
            {
              instructions: `The invite request to your friend ${invite.email} has been ${body.type}.`,
              button: {
                color: "#0190ea", // Optional action button color
                text: "Go to TPU",
                link: config.hostnameWithProtocol
              }
            }
          ]
        }
      },
      invite.user.email,
      `Your TPU invite request has been ${body.type}.`
    )
  }

  @UseBefore(LowLevel)
  @Get("/feedback")
  async getFeedback(@Auth("*") user: User) {
    return await this.adminService.getFeedback()
  }

  @UseBefore(LowLevel)
  @Get("/csv/uploads")
  async getUploadsCSV(@Auth("*") user: User, @Res() res: Response) {
    const csv = await this.adminService.exportCSVUploads()
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=uploads.csv")
    res.send(csv)
  }

  @UseBefore(LowLevel)
  @Patch("/ban")
  async banUser(
    @Auth("*") user: User,
    @Body()
    body: {
      id: number
      banned: boolean
    }
  ) {
    if (!body.id) throw Errors.INVALID_PARAMETERS
    await this.adminService.updateBanned(body.id, body.banned)
  }

  @UseBefore(LowLevel)
  @Post("/badge")
  async createBadge(
    @Auth("*") user: User,
    @Body()
    body: Badge
  ) {
    await this.adminService.createBadge(
      body.name,
      body.description,
      body.icon,
      body.color,
      body.tooltip,
      body.image
    )
  }

  @UseBefore(LowLevel)
  @Post("/badge/users")
  async createBadgeUser(
    @Auth("*") user: User,
    @Body()
    body: {
      id: number
      userIds: number[]
    }
  ) {
    await this.adminService.addUsersToBadge(body.userIds, body.id)
  }

  @UseBefore(LowLevel)
  @Put("/badge")
  async updateBadge(
    @Auth("*") user: User,
    @Body()
    body: Badge
  ) {
    await this.adminService.updateBadge(body)
  }

  @UseBefore(LowLevel)
  @Delete("/badge/:id")
  async deleteBadge(@Auth("*") user: User, @Param("id") id: number) {
    await this.adminService.deleteBadge(id)
  }

  @UseBefore(LowLevel)
  @Get("/badges")
  async getBadges(@Auth("*") user: User) {
    return await this.adminService.getBadges()
  }

  @UseBefore(LowLevel)
  @Post("/badge/users/delete")
  async deleteBadgeUser(
    @Auth("*") user: User,
    @Body()
    body: {
      id: number
      userIds: number[]
    }
  ) {
    await this.adminService.removeUsersFromBadge(body.userIds, body.id)
  }

  @UseBefore(HighLevel)
  @Post("/announcement")
  async createAnnouncement(
    @Auth("*") user: User,
    @Body()
    body: {
      content: string
    }
  ) {
    const announcement = await this.adminService.createAnnouncement(
      body.content,
      user.id
    )
    this.cacheService.refreshState()
    return announcement
  }

  @UseBefore(HighLevel)
  @Post("/notification")
  async createNotification(
    @Auth("*") user: User,
    @Body()
    body: {
      username: string
      content: string
      link: string
    }
  ) {
    if (body.username === "allOfThem") {
      // todo: optimize
      const users = await User.findAll()
      for (const user of users) {
        await this.userUtilsService.createNotification(
          user.id,
          body.content,
          body.link
        )
      }
      return
    }
    const rUser = await User.findOne({
      where: {
        username: body.username
      }
    })

    if (!rUser) {
      throw Errors.USER_NOT_FOUND
    }

    await this.userUtilsService.createNotification(
      rUser.id,
      body.content,
      body.link
    )
  }

  @UseBefore(HighLevel)
  @Get("/experiments/:userId")
  async getExperiments(@Auth("*") user: User, @Param("userId") userId: number) {
    const rUser = await User.findOne({
      where: {
        id: userId
      }
    })
    if (!rUser) throw Errors.USER_NOT_FOUND
    const dev = user ? rUser.administrator || rUser.moderator : false
    const experiment = await this.coreService.getUserExperiments(rUser.id, dev)
    return {
      ...experiment,
      defaults: this.coreService.getExperiments(dev)
    }
  }

  @UseBefore(HighLevel)
  @Post("/experiments/:userId")
  async setExperiments(
    @Auth("*") user: User,
    @Param("userId") userId: number,
    @Body()
    body: Record<string, boolean | number | undefined | null>
  ) {
    const rUser = await User.findOne({
      where: {
        id: userId
      }
    })
    if (!rUser) throw Errors.USER_NOT_FOUND
    const dev = user ? rUser.administrator || rUser.moderator : false
    const currentExperiments = await this.coreService.getUserExperiments(
      userId,
      dev
    )
    return await this.adminService.createExperimentOverrides(
      currentExperiments,
      body,
      user.id,
      dev
    )
  }

  @UseBefore(HighLevel)
  @Post("/restart")
  async restartTPUCluster(@Auth("admin.ci") user: User) {
    if (!process.send) throw Errors.UNKNOWN
    console.log("Restarting TPU")
    process.send("TPU_RESTART")
  }

  @UseBefore(HighLevel)
  @Patch("/gold")
  async updateUserGold(
    @Auth("*") user: User,
    @Body()
    body: {
      id: number
      planId: number
    }
  ) {
    if (!body.id || !body.planId) throw Errors.INVALID_PARAMETERS
    await this.adminService.updatePlanId(body.id, body.planId)
  }
}
