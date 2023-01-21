import { Service } from "typedi"
import { Op } from "sequelize"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import argon2 from "argon2"
import utils from "@app/lib/utils"
import speakeasy from "@levminer/speakeasy"

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

  async passwordReset(email: string): Promise<any> {
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
      passwordResetCodeExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
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
    totp: string
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
        "totpSecret"
      ]
    })
    if (!user) {
      throw Errors.INVALID_CREDENTIALS
    }
    if (user.password === "sso-enforced") {
      throw Errors.SSO_ENFORCED
    }
    if (!(await argon2.verify(user.password, password))) {
      throw Errors.INVALID_CREDENTIALS
    }
    if (user.totpEnable && user.totpSecret) {
      try {
        let tokenValidation = speakeasy.totp.verify({
          secret: user.totpSecret,
          token: totp,
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
    const session = await utils.createSession(user.id, "*", "session")
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
      inviteId: inviteId || null
    })
    const session = await utils.createSession(user.id, "*", "session")
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
