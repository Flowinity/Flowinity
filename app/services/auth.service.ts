import { Service, Container } from "typedi"
import { Op } from "sequelize"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import argon2 from "argon2"
import utils from "@app/lib/utils"
import speakeasy from "@levminer/speakeasy"
import { CacheService } from "@app/services/cache.service"
import { Login } from "@app/types/auth"

@Service()
export class AuthService {
  async passwordResetConfirm(code: string, password: string) {
    if (password?.length < 8) {
      throw Errors.PASSWORD_TOO_SHORT
    }
    const user = await User.findOne({
      where: {
        passwordResetCode: code,
        passwordResetExpiry: {
          [Op.gt]: new Date()
        }
      }
    })

    if (!user) {
      throw Errors.INVALID_PASSWORD_RESET_CODE
    }

    await user.update({
      password: await argon2.hash(password),
      passwordResetCode: null,
      passwordResetExpiry: null,
      flowinityId: null
    })

    return {
      username: user.username
    }
  }

  async passwordReset(
    email: string
  ): Promise<{ code: string; username: string; email: string }> {
    const user = await User.findOne({
      where: {
        email
      }
    })
    if (!user) {
      throw Errors.INVALID_EMAIL
    }
    const code = await utils.generateAPIKey("email")
    await user.update({
      passwordResetCode: code,
      passwordResetExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
    })
    return {
      code,
      username: user.username,
      email: user.email
    }
  }

  async login(
    username: string,
    password: string,
    totp?: string
  ): Promise<Login> {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          {
            username
          },
          {
            email: username
          }
        ]
      },
      attributes: [
        "id",
        "username",
        "password",
        "email",
        "totpEnable",
        "totpSecret",
        "alternatePasswords"
      ]
    })
    if (!user) {
      throw Errors.INVALID_CREDENTIALS
    }
    if (user.password === "sso-enforced") {
      throw Errors.SSO_ENFORCED
    }
    let alternatePassword = null
    if (!(await argon2.verify(user.password, password))) {
      if (!user.alternatePasswords) {
        throw Errors.INVALID_CREDENTIALS
      }
      for (const pw of user.alternatePasswords) {
        if (await argon2.verify(pw.password, password)) {
          alternatePassword = pw
          break
        }
      }
      if (!alternatePassword?.scopes) {
        throw Errors.INVALID_CREDENTIALS
      }
    }
    if (user.totpEnable && user.totpSecret && !alternatePassword) {
      try {
        let tokenValidation = await speakeasy.totp.verify({
          secret: user.totpSecret,
          token: totp?.replaceAll(" ", "") || "",
          encoding: "base32"
        })
        if (!tokenValidation) {
          throw Errors.INVALID_TOTP
        }
      } catch (e) {
        console.log(e)
        throw Errors.INVALID_TOTP
      }
    }
    const session = await utils.createSession(
      user.id,
      alternatePassword?.scopes ? alternatePassword?.scopes : "*",
      "session"
    )
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token: session
    }
  }

  async register(
    username: string,
    password: string,
    email: string,
    inviteId?: number
  ): Promise<Login> {
    if (password.length < 8) {
      throw Errors.PASSWORD_TOO_SHORT
    }
    const user = await User.create({
      username,
      password: await argon2.hash(password),
      email,
      inviteId: inviteId || null,
      planId: config.defaultPlanId || 1
    })
    const session = await utils.createSession(user.id, "*", "session")
    const cacheService = await Container.get(CacheService)
    await cacheService.generateChatsCache(user.id)
    cacheService.generateAutoCollectCache(user.id)
    cacheService.generateUserStatsCache(user.id)
    cacheService.generateInsightsCache(user.id)
    await cacheService.generateCollectionCache(user.id)
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token: session
    }
  }
}
