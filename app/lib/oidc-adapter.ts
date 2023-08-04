/* eslint-disable */
"use strict"

import { User } from "@app/models/user.model"

const grantable = new Set([
  "AccessToken",
  "AuthorizationCode",
  "RefreshToken",
  "DeviceCode",
  "BackchannelAuthenticationRequest"
])

function grantKeyFor(id: string) {
  return `oidc:grant:${id}`
}

function userCodeKeyFor(userCode: string) {
  return `oidc:userCode:${userCode}`
}

function uidKeyFor(uid: string) {
  return `oidc:uid:${uid}`
}

export default class OidcAdapter {
  name = ""
  constructor(name: string) {
    this.name = name
  }

  async upsert(id: string, payload: any, expiresIn: number) {
    const key = this.key(id)

    const multi = redis.multi()

    multi.call("JSON.SET", key, ".", JSON.stringify(payload))

    if (expiresIn) {
      multi.expire(key, expiresIn)
    }

    if (grantable.has(this.name) && payload.grantId) {
      const grantKey = grantKeyFor(payload.grantId)
      multi.rpush(grantKey, key)
      // if you're seeing grant key lists growing out of acceptable proportions consider using LTRIM
      // here to trim the list to an appropriate length
      const ttl = await redis.ttl(grantKey)
      if (expiresIn > ttl) {
        multi.expire(grantKey, expiresIn)
      }
    }

    if (payload.userCode) {
      const userCodeKey = userCodeKeyFor(payload.userCode)
      multi.set(userCodeKey, id)
      multi.expire(userCodeKey, expiresIn)
    }

    if (payload.uid) {
      const uidKey = uidKeyFor(payload.uid)
      multi.set(uidKey, id)
      multi.expire(uidKey, expiresIn)
    }

    await multi.exec()
  }

  async find(id: string) {
    const key = this.key(id)
    const data = await redis.call("JSON.GET", key)
    if (!data) return undefined
    return JSON.parse(data)
  }

  async findByUid(uid: string) {
    const id = await User.findByPk(uid).then((user) => {
      if (!user) return undefined
      return {
        id: user.id,
        username: user.username,
        uid: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        consumedAt: user.updatedAt
      }
    })
  }

  async findByUserCode(userCode: string) {
    const id = await redis.get(userCodeKeyFor(userCode))
    return this.find(id)
  }

  async destroy(id: string) {
    const key = this.key(id)
    await redis.del(key)
  }

  async revokeByGrantId(grantId: string) {
    // eslint-disable-line class-methods-use-this
    const multi = redis.multi()
    const tokens = await redis.lrange(grantKeyFor(grantId), 0, -1)
    tokens.forEach((token: string) => multi.del(token))
    multi.del(grantKeyFor(grantId))
    await multi.exec()
  }

  async consume(id: string) {
    await redis.call(
      "JSON.SET",
      this.key(id),
      "consumed",
      Math.floor(Date.now() / 1000)
    )
  }

  key(id: string) {
    return `oidc:${this.name}:${id}`
  }
}
