import { Service } from "typedi"
import axios from "axios"
import Errors from "@app/lib/errors"
import md5 from "md5"
import { Integration } from "@app/models/integration.model"
import qs from "qs"
import { ProfileLayoutComponent, User } from "@app/models/user.model"
import cron from "node-cron"

@Service()
export class ProviderService {
  constructor() {}

  async tenor(search: string, next: string | undefined = undefined) {
    const { data } = await axios.get(
      `https://tenor.googleapis.com/v2/search?q=${search}&key=${config.providers.tenor}&limit=20&pos=${next}`
    )
    return data
  }

  async verifyUser(username: string, provider: string, currentUserId: number) {
    const user = await User.findOne({
      where: {
        username: username
      },
      include: [
        {
          model: Integration,
          required: true,
          where: {
            type: provider
          }
        }
      ]
    })
    if (!user) throw Errors.USER_NOT_FOUND

    if (
      !user?.profileLayout?.layout.columns[0].rows.find(
        (row) => row.name === (provider === "lastfm" ? "last-fm" : provider)
      ) &&
      !user?.profileLayout?.layout.columns[0].rows
        .find((row) => row.name === "parent")
        ?.props.children.find(
          (child: ProfileLayoutComponent) =>
            child.name === (provider === "lastfm" ? "last-fm" : provider)
        ) &&
      user.id !== currentUserId
    )
      throw Errors.PROVIDER_WIDGET_DISABLED
    return user
  }

  async linkLastFM(userId: string, token: string) {
    const params = {
      method: "auth.getSession",
      token,
      api_key: config.providers.lastfm.key
    }
    console.log(this.generateLastFMSig(params))
    const { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/`, {
      params: {
        ...params,
        format: "json",
        api_sig: this.generateLastFMSig(params)
      }
    })
    if (!data?.session) throw Errors.INTEGRATION_ERROR
    await Integration.create({
      userId,
      type: "lastfm",
      accessToken: data.session.key,
      providerUsername: data.session.name
    })
    return {
      success: true
    }
  }

  async getLastFMOverview(
    userId: number,
    username: string,
    accessToken: string
  ) {
    const cache = await redis.get(`providers:lastfm:${userId}:overview`)
    if (cache) return JSON.parse(cache)
    const { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/`, {
      params: {
        method: "user.getrecenttracks",
        user: username,
        api_key: config.providers.lastfm.key,
        format: "json"
      }
    })
    redis.set(`providers:lastfm:${userId}:overview`, JSON.stringify(data), {
      EX: 10,
      NX: true
    })
    return data
  }

  generateLastFMSig(params: Record<string, string>) {
    delete params.api_sig
    delete params.format
    const keys = Object.keys(params).sort()
    const sig = keys
      .map((key) => `${key}${params[key]}`)
      .join("")
      .concat(config.providers.lastfm.secret)
    return md5(sig)
  }

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
        type: "mal"
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
      return
    }
  }

  async getMALOverview(userId: number, username: string, accessToken: string) {
    const cache = await redis.get(`providers:mal:${userId}:overview`)
    if (cache) return JSON.parse(cache)
    const { data } = await axios.get(
      `https://api.myanimelist.net/v2/users/@me/animelist?sort=list_updated_at&fields=updated_at,my_list_status,synopsis,comments,num_episodes,average_episode_duration&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
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
    body: {
      id: number
      num_episodes_watched?: number
      score?: number
      status?: string
    }
  ) {
    console.log(body)
    const { data } = await axios.put(
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
    console.log("[PROVIDERS] Renewing access tokens")
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
    console.log("[PROVIDERS] Renewed access tokens")
  }

  async providerInit() {
    cron.schedule("0 * * * *", () => {
      this.renewService()
    })
    this.renewService()
  }
}
