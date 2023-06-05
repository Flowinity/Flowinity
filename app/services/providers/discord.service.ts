import { Service } from "typedi"
import axios from "axios"

// Import Lib
import Errors from "@app/lib/errors"

// Import Models
import { Integration } from "@app/models/integration.model"
import { User } from "@app/models/user.model"
import cron from "node-cron"
import qs from "qs"

@Service()
export class DiscordService {
  constructor() {}

  async link(userId: number, token: string) {
    if (
      !config.providers.discord.publicKey ||
      !config.providers.discord.applicationId ||
      !config.providers.discord.oAuthClientId ||
      !config.providers.discord.oAuthClientSecret ||
      !config.providers.discord.oAuthRedirectUri
    )
      throw Errors.INTEGRATION_PROVIDER_NOT_CONFIGURED

    const existing = await Integration.findOne({
      where: {
        userId,
        type: "discord"
      }
    })

    if (existing) throw Errors.INTEGRATION_EXISTS

    try {
      const { data: authData } = await axios.post(
        `https://discord.com/api/v10/oauth2/token`,
        qs.stringify({
          client_id: config.providers.discord.oAuthClientId,
          client_secret: config.providers.discord.oAuthClientSecret,
          grant_type: "authorization_code",
          code: token,
          redirect_uri: config.providers.discord.oAuthRedirectUri
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )

      const userCache = await this.getUserCache(
        authData.token_type,
        authData.access_token
      )

      await Integration.create({
        userId,
        type: "discord",
        tokenType: authData.token_type,
        accessToken: authData.access_token,
        refreshToken: authData.refresh_token,
        expiresAt: new Date(Date.now() + authData.expires_in * 1000),
        providerUsername: userCache.username,
        providerUserId: userCache.id,
        providerUserCache: userCache
      })
    } catch (e) {
      console.log(e)
      throw Errors.INTEGRATION_ERROR
    }
  }

  async unlink(userId: string) {
    const existing = await Integration.findOne({
      where: {
        userId,
        type: "discord"
      }
    })

    if (!existing) throw Errors.INTEGRATION_ERROR

    await existing.destroy()
  }

  async getUserCache(tokenType: string, accessToken: string) {
    try {
      const { data } = await axios.get(
        `https://discord.com/api/v10/users/@me`,
        {
          headers: {
            Authorization: `${tokenType} ${accessToken}`
          }
        }
      )

      return data
    } catch {
      throw Errors.INTEGRATION_ERROR
    }
  }

  async renewTokens() {
    if (
      !config.providers.discord.publicKey ||
      !config.providers.discord.applicationId ||
      !config.providers.discord.oAuthClientId ||
      !config.providers.discord.oAuthClientSecret ||
      !config.providers.discord.oAuthRedirectUri
    )
      return Errors.INTEGRATION_PROVIDER_NOT_CONFIGURED

    try {
      console.log("[PROVIDERS/DISCORD] renewing access tokens...")

      const users = await User.findAll({
        include: [
          {
            model: Integration,
            as: "integrations",
            where: {
              type: "discord"
            }
          }
        ]
      })

      for (const user of users) {
        const integration = await Integration.findOne({
          where: {
            userId: user.id,
            type: "discord"
          }
        })

        if (!integration) continue

        const { data } = await axios.post(
          `https://discord.com/api/v10/oauth2/token`,
          qs.stringify({
            client_id: config.providers.discord.oAuthClientId,
            client_secret: config.providers.discord.oAuthClientSecret,
            grant_type: "refresh_token",
            refresh_token: integration.refreshToken
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )

        await integration.update({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: new Date(Date.now() + data.expires_in * 1000),
          tokenType: data.token_type
        })
      }

      console.log("[PROVIDERS/DISCORD] renewed access tokens.")
      return true
    } catch (e) {
      console.log(e)
      console.log("[PROVIDERS/DISCORD] failed to renew access tokens.")
      return false
    }
  }

  async providerInit() {
    cron.schedule("0 * * * *", () => {
      this.renewTokens()
    })

    await this.renewTokens()
  }
}
