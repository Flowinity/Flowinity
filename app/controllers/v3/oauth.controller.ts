import {
  Body,
  Delete,
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
  Put,
  Req
} from "routing-controllers"
import { Service } from "typedi"
import { SlideshowService } from "@app/services/slideshow.service"
import { Auth } from "@app/lib/auth"
import { User } from "@app/models/user.model"
import { Slideshow } from "@app/models/slideshow.model"
import cryptoRandomString from "crypto-random-string"
import Errors from "@app/lib/errors"
import { OauthService } from "@app/services/oauth.service"
import { OauthSave } from "@app/models/oauthSave.model"

@Service()
@JsonController("/oauth")
export class OauthControllerV3 {
  constructor(private readonly oauthService: OauthService) {}

  @Get("")
  async getOauthApps(@Auth("*") user: User) {
    return await this.oauthService.getApps(user.id)
  }

  @Get("/scopeDefinitions")
  async getScopeDefinitions() {
    return [
      {
        id: "oauth.user.email",
        name: "Access your email address"
      },
      {
        id: "oauth.user.id",
        name: "Access your user ID"
      },
      {
        id: "oauth.user.username",
        name: "Access your username"
      },
      {
        id: "oauth.user.avatar",
        name: "Access your avatar"
      },
      {
        id: "oauth.save",
        name: "Save a unique object to your account",
        description:
          "This can be used for game saves, will sync across devices, and can only be accessed by the application."
      }
    ]
  }

  @Get("/user")
  async getOauthUser(
    @Auth("oauth") user: User,
    @HeaderParam("x-tpu-app-id") verifyAppId?: string
  ) {
    if (verifyAppId && verifyAppId !== user.oauthAppId)
      throw Errors.SECURITY_APP_ID_ERROR
    const scopes = user.scopes.split(",")
    const data: { [key: string]: any } = {}
    if (scopes.includes("oauth.user.email")) data.email = user.email
    if (scopes.includes("oauth.user.id")) data.id = user.id
    if (scopes.includes("oauth.user.username")) data.username = user.username
    if (scopes.includes("oauth.user.avatar"))
      data.avatar = config.hostnameWithProtocol + "/i/" + user.avatar
    if (scopes.includes("oauth.save") && user.oauthAppId) {
      const save = await OauthSave.findOne({
        where: {
          userId: user.id,
          oauthAppId: user.oauthAppId
        }
      })
      if (save) data.save = save.data
    }
    data.oauthAppId = user.oauthAppId
    return data
  }

  @Post("/save")
  async saveOauthObject(
    @Auth("oauth") user: User,
    @Body() body: { data: any }
  ) {
    if (!user.oauthAppId) throw Errors.UNAUTHORIZED

    const save = await OauthSave.findOne({
      where: {
        userId: user.id,
        oauthAppId: user.oauthAppId
      }
    })
    if (save) {
      await save.update({
        data: body.data,
        history: [
          {
            data: save.data,
            createdAt: new Date().toISOString()
          },
          ...(save.history || []).slice(0, 11)
        ]
      })
    } else {
      await OauthSave.create({
        userId: user.id,
        oauthAppId: user.oauthAppId,
        data: body.data,
        history: [
          {
            data: body.data,
            createdAt: new Date().toISOString()
          }
        ]
      })
    }
    return
  }

  @Get("/:oauthAppId")
  async getOauthAppConfig(
    @Auth("oauth.authorize", false) user: User,
    @Param("oauthAppId") oauthAppId: string
  ) {
    const app = await this.oauthService.getApp(oauthAppId, user?.id)
    if (!app) throw Errors.NOT_FOUND
    return app
  }

  @Post("/:oauthAppId/authorize")
  async authorize(
    @Auth("oauth.authorize") user: User,
    @Param("oauthAppId") oauthAppId: string,
    @Body() body: { scopes: string }
  ) {
    const app = await this.oauthService.getApp(oauthAppId, user.id)
    if (!app) throw Errors.NOT_FOUND

    if (body.scopes !== app.scopes) throw Errors.SECURITY_SCOPE_ERROR

    if (app.private && app.userId !== user.id) throw Errors.PRIVATE_APP

    return {
      token: await this.oauthService.getOrCreateOauthToken(
        app.id,
        user.id,
        true,
        body.scopes
      )
    }
  }

  @Delete("/:oauthAppId/authorize")
  async deauthorize(
    @Auth("*") user: User,
    @Param("oauthAppId") oauthAppId: string
  ) {
    const app = await this.oauthService.getApp(oauthAppId, user.id)
    if (!app) throw Errors.NOT_FOUND

    await this.oauthService.deauthorize(app.id, user.id)
  }
}
