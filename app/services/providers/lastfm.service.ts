import { Service } from "typedi"
import Errors from "@app/lib/errors"
import { Integration } from "@app/models/integration.model"
import axios from "axios"
import md5 from "md5"

@Service()
export class LastfmService {
  constructor() {}
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
}
