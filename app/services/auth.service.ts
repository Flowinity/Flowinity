import { Service } from "typedi"
import { Op } from "sequelize"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import argon2 from "argon2"
import utils from "@app/lib/utils"
import speakeasy from "@levminer/speakeasy"

@Service()
export class AuthService {
  async login(username: string, password: string, totp: string): Promise<any> {
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
    if (!(await argon2.verify(user.password, password))) {
      throw Errors.INVALID_CREDENTIALS
    }
    if (user.totpEnable && user.totpSecret) {
      let tokenValidation = speakeasy.totp.verify({
        secret: user.totpSecret,
        encoding: "base32",
        token: totp
      })
      if (!tokenValidation) {
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
}
