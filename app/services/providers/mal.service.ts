import { Service } from "typedi"
import Errors from "@app/lib/errors"
import { Integration } from "@app/models/integration.model"
import axios from "axios"
import { User } from "@app/models/user.model"
import qs from "qs"
import cron from "node-cron"
import { MalBody } from "@app/interfaces/mal"

@Service()
export class MyAnimeListService {
  constructor() {}

  async linkMAL(userId: number, token: string) {
    try {
      const { data } = await axios.post(
        `https://myanimelist.net/v1/oauth2/token`,
        qs.stringify({
          client_id: config.providers.mal.key,
          client_secret: config.providers.mal.secret,
          code: token,
          code_verifier: await redis.get(
            `providers:mal:${userId}:code_challenge`
          ),
          grant_type: "authorization_code"
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )
      if (!data?.access_token) throw Errors.INTEGRATION_ERROR
      const { data: user } = await axios.get(
        "https://api.myanimelist.net/v2/users/@me?fields=anime_statistics,manga_statistics",
        {
          headers: {
            Authorization: `${data.token_type} ${data.access_token}`
          }
        }
      )
      await Integration.create({
        userId,
        type: "mal",
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        providerUsername: user.name,
        providerUserId: user.id,
        providerUserCache: user,
        tokenType: data.token_type,
        expiresAt: data.expires_in
      })
      return {
        success: true
      }
    } catch (e) {
      console.log(e)
      throw Errors.INTEGRATION_ERROR
    }
  }

  async renewMAL(userId: number) {
    const integration = await Integration.findOne({
      where: {
        userId,
        type: "mal",
        error: null
      }
    })
    if (!integration) return
    try {
      const { data } = await axios.post(
        `https://myanimelist.net/v1/oauth2/token`,
        qs.stringify({
          client_id: config.providers.mal.key,
          client_secret: config.providers.mal.secret,
          refresh_token: integration.refreshToken,
          grant_type: "refresh_token"
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )
      if (!data?.access_token) {
        await integration.destroy()
        return
      }
      const { data: user } = await axios.get(
        "https://api.myanimelist.net/v2/users/@me?fields=anime_statistics,manga_statistics",
        {
          headers: {
            Authorization: `${data.token_type} ${data.access_token}`
          }
        }
      )
      await integration.update({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        providerUsername: user.name,
        providerUserId: user.id,
        providerUserCache: user,
        tokenType: data.token_type,
        expiresAt: data.expires_in
      })
      return {
        success: true
      }
    } catch (e) {
      console.log(e)
      if (e?.response?.data?.hint) {
        integration.update({
          error: e.response.data.hint
        })
      }
      return
    }
  }

  async getMALOverview(userId: number, username: string, accessToken: string) {
    const cache = await redis.get(`providers:mal:${userId}:overview`)
    if (cache) return JSON.parse(cache)
    const { data } = await axios
      .get(
        `https://api.myanimelist.net/v2/users/@me/animelist?sort=list_updated_at&fields=updated_at,my_list_status,synopsis,comments,num_episodes,average_episode_duration&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      .catch((e) => {
        console.log(e)
        throw Errors.INTEGRATION_ERROR
      })
    const d = {
      ...data,
      user: await this.getMALUserCache(userId, username, accessToken)
    }
    redis.set(`providers:mal:${userId}:overview`, JSON.stringify(d), {
      EX: 60 * 15,
      NX: true
    })
    return d
  }

  async updateMALAnime(
    userId: number,
    username: string,
    accessToken: string,
    body: MalBody
  ) {
    const { data } = await axios
      .put(
        `https://api.myanimelist.net/v2/anime/${body.id}/my_list_status`,
        qs.stringify({
          num_watched_episodes: body.num_episodes_watched,
          score: body.score,
          status: body.status
        }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )
      .catch((e) => {
        console.log(e)
        throw Errors.INTEGRATION_ERROR
      })
    console.log(data)
    await redis.del(`providers:mal:${userId}:overview`)
    return {
      success: true
    }
  }

  async getMALUserCache(userId: number, username: string, accessToken: string) {
    const integration = await Integration.findOne({
      where: {
        userId,
        type: "mal"
      }
    })
    if (!integration) return null
    // delete potentially sensitive fields, MAL sends them even if you opt out of the privacy setting
    delete integration.providerUserCache?.birthday
    delete integration.providerUserCache?.location
    delete integration.providerUserCache?.gender
    return integration.providerUserCache
  }

  async renewService() {
    if (!config.providers.mal.key) return
    console.log("[PROVIDERS/MYANIMELIST] Renewing access tokens")
    const users = await User.findAll({
      include: [
        {
          model: Integration,
          as: "integrations",
          where: {
            type: "mal"
          }
        }
      ]
    })
    for (const user of users) {
      await this.renewMAL(user.id)
    }
    console.log("[PROVIDERS/MYANIMELIST] Renewed access tokens")
  }

  async providerInit() {
    if (config.release === "dev") return
    cron.schedule("0 * * * *", () => {
      this.renewService()
    })
    this.renewService()
  }
}
