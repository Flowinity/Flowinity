import {
  Body,
  Delete,
  Get,
  Head,
  JsonController,
  OnUndefined,
  Param,
  Patch,
  Post,
  QueryParam,
  Res,
  UploadedFile,
  UseBefore
} from "routing-controllers"
import { UserUtilsService } from "@app/services/userUtils.service"
import { Service } from "typedi"
import { Auth } from "@app/lib/auth"
import Errors from "@app/lib/errors"
import { AutoCollectCache } from "@app/types/collection"
import { Notification } from "@app/models/notification.model"
import { User } from "@app/models/user.model"
import rateLimits from "@app/lib/rateLimits"
import uploader from "@app/lib/upload"
import { GalleryService } from "@app/services/gallery.service"
import { BadgeAssociation } from "@app/models/badgeAssociation.model"
import { Plan } from "@app/models/plan.model"
import { Response } from "express"
import fs from "fs"
import sharp from "sharp"
import { PatchUser } from "@app/types/auth"
import axios from "axios"
import { OpenAPI } from "routing-controllers-openapi"

@Service()
@JsonController("/user")
export class UserControllerV3 {
  constructor(
    private userUtilsService: UserUtilsService,
    private galleryService: GalleryService
  ) {}

  @Get("")
  async getUser(@Auth("user.view") user: User) {
    const pendingAutoCollects = await redis.json
      .get(`autoCollects:${user.id}`)
      .then((autoCollects: AutoCollectCache[]) => {
        if (!autoCollects?.length) return 0
        return autoCollects.reduce(
          (acc, curr) => acc + curr.autoCollectApprovals.length,
          0
        )
      })

    const notifications = await Notification.findAll({
      where: {
        userId: user.id
      },
      order: [["createdAt", "DESC"]],
      limit: 15
    })

    return {
      ...user,
      pendingAutoCollects,
      notifications,
      platforms: await redis.json.get(`user:${user.id}:platforms`)
    }
  }

  @OnUndefined(204)
  @Patch("/notifications")
  async updateNotifications(@Auth("user.modify") user: User) {
    await Notification.update(
      {
        dismissed: true
      },
      {
        where: {
          userId: user.id
        }
      }
    )
  }

  @OpenAPI({
    description: "Used for TPU Kotlin"
  })
  @Post("/friends/username/:username/:action")
  async addFriendByUsername(
    @Auth("user.modify") user: User,
    @Param("username") username: string,
    @Param("action") action: "accept" | "remove" | "send"
  ) {
    await this.userUtilsService.friend(user.id, username, "username", action)
  }

  @OnUndefined(204)
  @Post("/friends/:id")
  async addFriend(@Auth("user.modify") user: User, @Param("id") id: number) {
    await this.userUtilsService.friend(user.id, id, "id")
  }

  @Get("/all")
  async getAllUsers(
    @Auth("user.view") user: User,
    @QueryParam("page") page: number,
    @QueryParam("sort") sort: string,
    @QueryParam("order") order: string,
    @QueryParam("search") search: string
  ) {
    return await this.userUtilsService.getAllUsers(page, sort, order, search)
  }

  @Get("/profile/:username")
  async getUserProfile(
    @Auth("user.view", false) authUser: User,
    @Param("username") username: string
  ) {
    const user = await this.userUtilsService.getUser(username, authUser?.id)
    if (!user || (!user?.publicProfile && !authUser))
      throw Errors.USER_NOT_FOUND

    return user
  }

  @OnUndefined(204)
  @Patch("/domain")
  async updateDomain(
    @Auth("user.modify") user: User,
    @Body() body: { domain: string }
  ) {
    await this.userUtilsService.setDefaultDomain(user.id, body.domain)
  }

  @OnUndefined(204)
  @Post("/feedback")
  @UseBefore(rateLimits.standardLimiter)
  async sendFeedback(
    @Auth("user.modify") user: User,
    @Body() body: { text: string; starRating: number; route: string }
  ) {
    if (!config.officialInstance) {
      try {
        axios.post("https://images.flowinity.com/api/v3/instances/feedback", {
          text: body.text,
          starRating: body.starRating,
          route: body.route,
          userId: user.id,
          instance: config.hostname
        })
      } catch (e) {
        console.error("Could not send feedback to official instance")
      }
    }
    await this.userUtilsService.sendFeedback(
      user.id,
      body.text,
      body.starRating,
      body.route
    )
  }

  @OnUndefined(204)
  @Patch("")
  async updateUser(
    @Auth("user.modify") user: User,
    @Body()
    body: PatchUser
  ) {
    await this.userUtilsService.updateUser(user.id, body)
  }

  @OnUndefined(204)
  @Patch("/totp")
  async updateTotp(
    @Auth("user.modify") user: User,
    @Body()
    body: {
      action: "enable" | "disable" | "validate"
      code: string
      password: string
    }
  ) {
    switch (body.action) {
      case "enable":
        if (
          !(await this.userUtilsService.checkPassword(user.id, body.password))
        ) {
          throw Errors.INVALID_CREDENTIALS
        }
        return await this.userUtilsService.enable2FA(user.id)
      case "disable":
        if (
          !(await this.userUtilsService.checkPassword(user.id, body.password))
        ) {
          throw Errors.INVALID_CREDENTIALS
        }
        await this.userUtilsService.act2FA(user.id, body.code, "disable")
        return
      case "validate":
        await this.userUtilsService.act2FA(user.id, body.code, "validate")
        return
      default:
        throw Errors.INVALID_PARAMETERS
    }
  }

  @OnUndefined(204)
  @Post("/upload/:type")
  @UseBefore(rateLimits.uploadLimiterUser)
  async updateBanner(
    @Auth("user.modify") user: User,
    @UploadedFile("banner", {
      options: uploader
    })
    banner: Express.Multer.File,
    @Param("type") type: "banner" | "avatar"
  ) {
    if (type !== "banner" && type !== "avatar") throw Errors.INVALID_PARAMETERS
    const ban = await this.galleryService.createUpload(
      user.id,
      banner,
      false,
      false
    )
    await this.userUtilsService.updateBanner(
      user.id,
      ban.upload.attachment,
      type
    )
  }

  @OnUndefined(204)
  @Delete("/upload/:type")
  async deleteBanner(
    @Auth("user.modify") user: User,
    @Param("type") type: "banner" | "avatar"
  ) {
    if (type !== "banner" && type !== "avatar") throw Errors.INVALID_PARAMETERS
    await this.userUtilsService.updateBanner(user.id, null, type)
  }

  @Get("/friends")
  async getFriends(@Auth("user.view") user: User) {
    return await this.userUtilsService.getFriends(user.id)
  }

  @OnUndefined(204)
  @UseBefore(rateLimits.mailLimiter)
  @Post("/verification/send")
  async sendVerification(@Auth("user.modify") user: User) {
    await this.userUtilsService.sendVerificationEmail(user.id)
  }

  @OnUndefined(204)
  @Patch("/verification")
  async verifyUser(
    @Body() body: { token: string }
  ) {
    await this.userUtilsService.verifyEmail(body.token)
  }

  @OnUndefined(204)
  @Head("/getRekt")
  async getRekt(@Auth("user.modify") user: User) {
    if (
      await BadgeAssociation.findOne({
        where: { badgeId: 30, userId: user.id }
      })
    )
      return
    await BadgeAssociation.create({
      badgeId: 30,
      userId: user.id
    })
  }

  @OnUndefined(204)
  @Patch("/nickname/:userId")
  async updateNickname(
    @Auth("user.view") user: User,
    @Param("userId") userId: number,
    @Body() body: { nickname: string }
  ) {
    await this.userUtilsService.setFriendNickname(
      user.id,
      userId,
      body.nickname
    )
  }

  @Get("/favicon.png")
  async getFavicon(
    @QueryParam("username") username: string,
    @Res() res: Response
  ) {
    const user = await User.findOne({
      where: { username: username },
      include: [
        {
          model: Plan,
          as: "plan"
        }
      ]
    })
    if (
      !user ||
      !user?.themeEngine ||
      (user.plan.internalName !== "GOLD" && config.officialInstance)
    ) {
      res.sendFile("/favicon.png", {
        root: "./frontend/public"
      })
      return res
    }
    const gradient1 = user?.themeEngine?.theme.dark.colors.logo1
    const gradient2 = user?.themeEngine?.theme.dark.colors.logo2
    // get SVG file
    const svg = await fs.readFileSync("./frontend/public/favicon.svg")
    // replace colors
    const svgString = svg.toString().replace(/#008FE9/g, gradient1)
    const svgString2 = svgString.replace(/#006AEE/g, gradient2)
    // convert to PNG
    const png = await sharp(Buffer.from(svgString2))
      .png()
      .resize(128, 128)
      .toBuffer()

    res.set("Content-Type", "image/png")
    res.send(png)
    return res
  }

  @Post("/fcmToken")
  async registerFCMToken(
    @Auth("user.modify") user: User,
    @Body() body: { token: string }
  ) {
    await this.userUtilsService.registerFCMToken(user.id, body.token)
  }
}
