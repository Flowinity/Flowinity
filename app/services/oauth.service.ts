import { Service } from "typedi"
import Errors from "@app/lib/errors"
import { OauthApp } from "@app/models/oauthApp.model"
import { Session } from "@app/models/session.model"
import utils from "@app/lib/utils"

@Service()
export class OauthService {
  async getApp(oauthAppId: string, userId: number) {
    const app = await OauthApp.findOne({
      where: {
        id: oauthAppId
      }
    })
    if (!app) throw Errors.NOT_FOUND
    if (userId) {
      const session = await Session.findOne({
        where: {
          oauthAppId,
          userId,
          type: "oauth"
        }
      })
      if (session) {
        return {
          ...app.toJSON(),
          scopes: session.scopes,
          token: session.token
        }
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
  }
}
