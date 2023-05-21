import { Service } from "typedi"
import axios from "axios"

// Import Lib
import Errors from "@app/lib/errors"

// Import Models
import { Integration } from "@app/models/integration.model"

@Service()
export class DiscordService {
  constructor() {}

  async link(userId: string, token: string) {
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
      const authData = await axios
        .post(
          `https://discord.com/api/v10/oauth2/token`,
          {
            client_id: config.providers.discord.oAuthClientId,
            client_secret: config.providers.discord.oAuthClientSecret,
            grant_type: "authorization_code",
            code: token,
            redirect_uri: config.providers.discord.oAuthRedirectUri
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then((res) => res.data)

      const { data } = await axios.get(
        `https://discord.com/api/v10/users/@me`,
        {
          headers: {
            Authorization: `${authData.token_type} ${authData.access_token}`
          }
        }
      )

      await Integration.create({
        userId,
        type: "discord",
        tokenType: authData.token_type,
        accessToken: authData.access_token,
        refreshToken: authData.refresh_token,
        expiresAt: new Date(Date.now() + authData.expires_in * 1000),
        providerUsername: data.username,
        providerUserId: data.id,
        providerUserCache: data
      })
    } catch {
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
}
