import { Service } from "typedi"
import {
  All,
  BadRequestError,
  Body,
  Get,
  Header,
  HeaderParam,
  JsonController,
  Post,
  Req,
  Res
} from "routing-controllers"
import { OauthService } from "@app/services/oauth.service"
import { OidcTokenBody } from "@app/interfaces/oidc"
import { User } from "@app/models/user.model"
import { Session } from "@app/models/session.model"
import jwt from "jsonwebtoken"
import { exportJWK } from "jose"
import fs from "fs"
import { Plan } from "@app/models/plan.model"

@Service()
@JsonController("/oidc")
export class OidcControllerV3 {
  constructor(private readonly oauthService: OauthService) {}

  @Post("/token")
  async validateToken(@Body() body: OidcTokenBody) {
    const session = await Session.findOne({
      where: {
        token: body.code,
        type: "oauth"
      }
    })
    if (!session) throw new BadRequestError("Invalid code")
    const client = await this.oauthService.getApp(session.oauthAppId)
    if (!client) throw new BadRequestError("Invalid client ID")
    if (!client.secret)
      throw new BadRequestError("This app is not configured for OpenID Connect")
    if (
      client.secret !== body.client_secret &&
      body.client_secret !== undefined
    )
      throw new BadRequestError("Invalid client secret")
    switch (body.grant_type) {
      case "authorization_code":
        return await this.oauthService.createOidcToken(
          client,
          body.code,
          body.redirect_uri
        )
      default:
        throw new BadRequestError("Invalid grant type")
    }
  }

  @Post("/userinfo")
  @Get("/userinfo")
  async getUserInfo(@HeaderParam("Authorization") authorization: string) {
    const auth = authorization.split(" ")[1]
    const token = await this.oauthService.getOidcToken(auth)
    if (!token) {
      throw new BadRequestError("Bearer error=invalid_token")
    }
    const user = await User.findOne({
      where: {
        id: token.userId
      },
      include: [
        {
          model: Plan,
          as: "plan",
          required: true
        }
      ]
    })
    if (!user) {
      throw new BadRequestError("Bearer error=invalid_token")
    }
    return await this.oauthService.identityToken(
      user,
      token.oauthAppId,
      true,
      token.scopes
    )
  }

  @Get("/jwks.json")
  async getJwks() {
    const key = await exportJWK(fs.readFileSync(appRoot + "/config/public.pem"))
    return {
      keys: [key]
    }
  }
}
