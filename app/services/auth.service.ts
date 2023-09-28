import { Container, Service } from "typedi"
import { Op } from "sequelize"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import argon2 from "argon2"
import utils from "@app/lib/utils"
import speakeasy from "@levminer/speakeasy"
import { CacheService } from "@app/services/cache.service"
import { Login } from "@app/types/auth"
import { Session } from "@app/models/session.model"
import { GraphQLError } from "graphql/error"
import {
  AuthValidationRequirements,
  AuthValidationResponse
} from "@app/classes/graphql/auth/requirements"
import { undefined } from "zod"
import { partialUserBase } from "@app/classes/graphql/user/partialUser"
import { LoginResponse } from "@app/classes/graphql/auth/login"
import { GqlError } from "@app/lib/gqlErrors"

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

  async validateAuthMethod(
    requirements: AuthValidationRequirements,
    gql: boolean = true
  ): Promise<AuthValidationResponse> {
    if (!requirements.credentials.password && requirements.password) {
      throw gql
        ? new GqlError("INVALID_CREDENTIALS")
        : Errors.INVALID_CREDENTIALS
    }
    if (!requirements.password && !requirements.totp) {
      throw new GraphQLError("No requirements specified.")
    }
    const user = await User.findOne({
      where: {
        [Op.or]: requirements.userId
          ? [
              {
                id: requirements.userId
              }
            ]
          : [
              {
                username: requirements.username || ""
              },
              {
                email: requirements.username || ""
              }
            ]
      },
      attributes: [
        ...partialUserBase,
        "totpSecret",
        "totpEnable",
        "password",
        "alternatePasswords",
        "email"
      ]
    })
    if (!user) {
      throw gql
        ? new GqlError("INVALID_CREDENTIALS")
        : Errors.INVALID_CREDENTIALS
    }
    if (user.password === "sso-enforced" && requirements.password) {
      throw gql ? new GqlError("SSO_ENFORCED") : Errors.SSO_ENFORCED
    }
    let alternatePassword = null
    if (
      requirements.password &&
      !(await argon2.verify(
        user.password,
        <string>requirements.credentials.password
      ))
    ) {
      if (!user.alternatePasswords || !requirements.alternatePassword) {
        throw gql
          ? new GqlError("INVALID_CREDENTIALS")
          : Errors.INVALID_CREDENTIALS
      }
      for (const pw of user.alternatePasswords) {
        if (
          await argon2.verify(
            pw.password,
            <string>requirements.credentials.password
          )
        ) {
          alternatePassword = pw
          break
        }
      }
      if (!alternatePassword?.scopes) {
        throw gql
          ? new GqlError("INVALID_CREDENTIALS")
          : Errors.INVALID_CREDENTIALS
      }
    }
    if (
      user.totpEnable &&
      user.totpSecret &&
      !alternatePassword &&
      requirements.totp
    ) {
      try {
        let tokenValidation = speakeasy.totp.verify({
          secret: user.totpSecret,
          token: requirements.credentials.totp?.replaceAll(" ", "") || "",
          encoding: "base32"
        })
        if (!tokenValidation) {
          throw gql ? new GqlError("INVALID_TOTP") : Errors.INVALID_TOTP
        }
      } catch (e) {
        console.log(e)
        throw gql ? new GqlError("INVALID_TOTP") : Errors.INVALID_TOTP
      }
    }
    return {
      alternatePassword,
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    }
  }

  async login(
    username: string,
    password: string,
    totp?: string,
    gql: boolean = false
  ): Promise<LoginResponse> {
    const validation = await this.validateAuthMethod(
      {
        credentials: {
          password,
          totp
        },
        username,
        password: true,
        alternatePassword: true,
        totp: true
      },
      gql
    )

    const session = await utils.createSession(
      validation.user.id,
      validation.alternatePassword?.scopes
        ? validation.alternatePassword.scopes
        : "*",
      "session"
    )
    return {
      user: validation.user,
      token: session
    }
  }

  async register(
    username: string,
    password: string,
    email: string,
    inviteId?: number
  ): Promise<Login> {
    try {
      if (password.length < 8) {
        throw new GraphQLError("Password is too short!")
      }
      const user = await User.create(
        {
          username,
          password: await argon2.hash(password),
          email,
          inviteId: inviteId || null,
          planId: config.defaultPlanId || 1,
          // TODO: REMOVE THIS!!!!!!!!!!
          emailVerified: true
        },
        {
          logging: true
        }
      )
      const session = await utils.createSession(user.id, "*", "session")
      const cacheService = Container.get(CacheService)
      //await cacheService.generateChatsCache(user.id)
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
    } catch (e) {
      if (!(e instanceof GraphQLError)) {
        throw new GqlError("USERNAME_TAKEN")
      }
      throw e
    }
  }

  async logout(token: string) {
    const session = await Session.findOne({
      where: {
        token
      }
    })
    if (!session) {
      throw new GraphQLError("Invalid token")
    }
    await session.destroy()
    return true
  }
}
