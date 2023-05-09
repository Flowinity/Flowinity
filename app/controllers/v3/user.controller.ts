import {
  Body,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Patch,
  Post,
  QueryParam,
  UseBefore,
  UploadedFile
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

@Service()
@JsonController("/user")
export class UserController {
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
      limit: 15,
      raw: true
    })

    return {
      ...user,
      pendingAutoCollects,
      notifications
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

  @OnUndefined(204)
  @Post("/friends/:id")
  async addFriend(@Auth("user.modify") user: User, @Param("id") id: number) {
    await this.userUtilsService.friend(user.id, id)
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
    @Auth("user.view") user: User,
    @Param("username") username: string
  ) {
    return await this.userUtilsService.getUser(username, user.id)
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
  async sendFeedback(
    @Auth("user.modify") user: User,
    @Body() body: { text: string; starRating: number; route: string }
  ) {
    await this.userUtilsService.sendFeedback(
      user.id,
      body.text,
      body.starRating,
      body.route
    )
  }

  @OnUndefined(204)
  @Patch("")
  async updateUser(@Auth("user.modify") user: User, @Body() body: User) {
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
  @UseBefore(uploader.single("banner"))
  async updateBanner(
    @Auth("user.modify") user: User,
    @UploadedFile("banner") banner: Express.Multer.File,
    @Param("type") type: "banner" | "avatar"
  ) {
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
}
