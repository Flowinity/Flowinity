import { Service } from "typedi"
import axios from "axios"
import md5 from "md5"

// Import Lib
import Errors from "@app/lib/errors"

// Import Models
import { Integration } from "@app/models/integration.model"

@Service()
export class LastfmService {
  constructor() {}

  async link(userId: string, token: string) {
    if (!config.providers.lastfm.key || !config.providers.lastfm.secret)
      throw Errors.INTEGRATION_PROVIDER_NOT_CONFIGURED

    const existing = await Integration.findOne({
      where: {
        userId,
        type: "lastfm"
      }
    })

    if (existing) throw Errors.INTEGRATION_EXISTS

    try {
      const params = {
        method: "auth.getSession",
        token,
        api_key: config.providers.lastfm.key
      }
      const { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/`, {
        params: {
          ...params,
          format: "json",
          api_sig: this.generateSig(params)
        }
      })

      await Integration.create({
        userId,
        type: "lastfm",
        accessToken: data.session.key,
        providerUsername: data.session.name
      })
    } catch {
      throw Errors.INTEGRATION_ERROR
    }
  }

  async unlink(userId: string) {
    const existing = await Integration.findOne({
      where: {
        userId,
        type: "lastfm"
      }
    })

    if (!existing) throw Errors.INTEGRATION_ERROR

    await existing.destroy()
  }

  async getOverview(userId: number, username: string, accessToken: string) {
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

  generateSig(params: Record<string, string>) {
    if (!config.providers.lastfm.secret) throw Errors.INTEGRATION_ERROR

    delete params.api_sig
    delete params.format

    const keys = Object.keys(params).sort()
    const sig = keys
      .map((key) => `${key}${params[key]}`)
      .join("")
      .concat(config.providers.lastfm.secret)

    return md5(sig)
  }
}
