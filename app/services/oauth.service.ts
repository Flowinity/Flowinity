import { Service } from "typedi"
import Errors from "@app/lib/errors"
import { OauthApp } from "@app/models/oauthApp.model"
import { Session } from "@app/models/session.model"
import utils from "@app/lib/utils"
import { User } from "@app/models/user.model"
import jwt from "jsonwebtoken"
import { IdentityToken } from "@app/interfaces/oidc"
import { BadRequestError } from "routing-controllers"
import fs from "fs"
import { Plan } from "@app/models/plan.model"
import { GqlError } from "@app/lib/gqlErrors"

@Service()
export class OauthService {
  async getApp(oauthAppId: string, userId?: number): Promise<OauthApp> {
    const app = await OauthApp.findOne({
      where: {
        id: oauthAppId
      },
      attributes: {
        include: ["secret"]
      }
    })
    if (!app) throw new GqlError("APP_NOT_FOUND")
    if (userId) {
      const session = await Session.findOne({
        where: {
          oauthAppId,
          userId,
          type: "oauth"
        }
      })
      if (session) {
        app.scopes = session.scopes
        app.token = session.token
        app.dataValues.scopes = session.scopes
        app.dataValues.token = session.token
        return app
      }
    }
    return app
  }

  async getOrCreateOauthToken(
    oauthAppId: string,
    userId: number,
    create = true,
    scopes: string
  ) {
    const oauthToken = await Session.findOne({
      where: {
        oauthAppId,
        userId,
        type: "oauth"
      }
    })

    if (oauthToken) return oauthToken.token

    if (!create) return null

    const session = await Session.create({
      oauthAppId,
      userId,
      token: await utils.generateAPIKey("oauth"),
      type: "oauth",
      scopes,
      expiredAt: null
    })

    if (!session) return null

    return session.token
  }

  async getApps(userId: number) {
    return OauthApp.findAll({
      include: [
        {
          model: Session,
          where: {
            type: "oauth",
            userId
          },
          required: true,
          attributes: [
            "expiredAt",
            "id",
            "scopes",
            "userId",
            "oauthAppId",
            "info"
          ]
        }
      ]
    })
  }

  async deauthorize(oauthAppId: string, userId: number) {
    const session = await Session.findOne({
      where: {
        oauthAppId,
        userId,
        type: "oauth"
      }
    })
    if (!session) throw Errors.NOT_FOUND
    await session.destroy()
    await redis.del(`oauth:token:${session.token}`)
  }

  // OIDC
  async createOidcToken(client: OauthApp, code: string, redirectUri: string) {
    const session = await Session.findOne({
      where: {
        oauthAppId: client.id,
        type: "oauth",
        token: code
      },
      include: [
        {
          model: User,
          required: true,
          include: [
            {
              model: Plan,
              as: "plan",
              required: true
            }
          ]
        }
      ]
    })
    if (!session) return null
    if (redirectUri !== client.redirectUri)
      throw new BadRequestError("Invalid redirect uri")
    const accessToken = await utils.generateAPIKey("oidc")
    await redis.set(
      `oidc:accessToken:${accessToken}`,
      JSON.stringify({
        userId: session.userId,
        oauthAppId: client.id,
        scopes: session.scopes
      }),
      {
        EX: 60 * 60 * 2
      }
    )
    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 60 * 60 * 2,
      refresh_token: code,
      id_token: jwt.sign(
        await this.identityToken(
          session.user,
          client.id,
          false,
          session.scopes
        ),
        fs.readFileSync(appRoot + "/config/private.pem")
      )
    }
  }

  async identityToken(
    user: User,
    clientId: string,
    partial: boolean = false,
    scopes: string = ""
  ) {
    let data: IdentityToken = {
      iss: config.hostnameWithProtocol,
      sub: user.id.toString(),
      aud: clientId,
      name: scopes.includes("oauth.user.username") ? user.username : undefined,
      email: scopes.includes("oauth.user.email") ? user.email : undefined,
      picture: scopes.includes("oauth.user.avatar")
        ? config.hostnameWithProtocol + "/i/" + user.avatar
        : undefined,
      preferred_username: scopes.includes("oauth.user.username")
        ? user.username
        : undefined,
      tpu_administrator: user.administrator,
      tpu_moderator: user.moderator,
      tpu_subscription: user.plan.internalName,
      created_at: user.createdAt,
      tpu_has_gold: user.plan.internalName === "GOLD"
    }
    if (!partial) {
      data = {
        ...data,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
        iat: Math.floor(Date.now() / 1000)
      }
    }
    return data
  }

  async getOidcToken(token: string) {
    const data = await redis.get(`oidc:accessToken:${token}`)
    if (!data) return null
    return JSON.parse(data)
  }
}
