import { Service } from "typedi"
import { User } from "@app/models/user.model"
import { Plan } from "@app/models/plan.model"
import Errors from "@app/lib/errors"
import { Domain } from "@app/models/domain.model"
import { Feedback } from "@app/models/feedback.model"
import argon2 from "argon2"
import speakeasy from "@levminer/speakeasy"

@Service()
export class UserUtilsService {
  async enable2FA(id: number): Promise<object> {
    const code = speakeasy.generateSecret({
      name: "TroploPrivateUploader"
    })
    await User.update(
      {
        totpSecret: code.base32
      },
      {
        where: {
          id,
          totpEnable: false
        }
      }
    )
    return {
      secret: code.base32,
      url: code.otpauth_url
    }
  }

  async act2FA(
    id: number,
    code: string,
    type: "validate" | "disable"
  ): Promise<any> {
    const user = await User.findOne({
      where: {
        id
      },
      attributes: ["totpSecret"]
    })

    if (!user?.totpSecret) throw Errors.USER_NOT_FOUND

    try {
      const verify = speakeasy.totp.verify({
        secret: user.totpSecret,
        token: code,
        encoding: "base32"
      })
      if (!verify) throw Errors.INVALID_TOTP
    } catch {
      throw Errors.INVALID_TOTP
    }

    const values =
      type === "validate"
        ? { totpEnable: true }
        : { totpEnable: false, totpSecret: null }

    await User.update(values, {
      where: {
        id
      }
    })

    return true
  }

  async checkPassword(id: number, password: string): Promise<boolean> {
    const user = await User.findOne({
      where: {
        id
      },
      attributes: ["password"]
    })
    if (!user) throw Errors.USER_NOT_FOUND
    return await argon2.verify(user.password, password)
  }

  async updateUser(id: number, body: PatchUser): Promise<any> {
    const user = await User.findOne({
      where: {
        id
      },
      attributes: ["id", "username", "email", "password"]
    })
    if (!user) throw Errors.USER_NOT_FOUND

    // from body, remove all empty values
    for (const key in body) {
      if (body[key] === "") {
        delete body[key]
      }
    }

    if (body.currentPassword) {
      if (!(await argon2.verify(user.password, body.currentPassword))) {
        throw Errors.INVALID_CREDENTIALS
      }
      if (body.password) {
        body.password = await argon2.hash(body.password)
      }
    } else {
      delete body.password
      delete body.currentPassword
      delete body.username
    }

    return await user.update(body)
  }
  async getInvite(key: string): Promise<string> {
    return key
  }

  async getAllUsers(): Promise<User[]> {
    return User.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "description",
        "administrator",
        "darkTheme",
        "banned",
        "inviteId",
        "avatar"
      ],
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Plan,
          as: "plan"
        }
      ]
    })
  }

  async getUser(username: string): Promise<User | null> {
    return await User.findOne({
      where: {
        username: username
      },
      attributes: [
        "id",
        "username",
        "email",
        "description",
        "administrator",
        "darkTheme",
        "banned",
        "inviteId",
        "avatar"
      ],
      include: [
        {
          model: Plan,
          as: "plan"
        }
      ]
    })
  }

  async setDefaultDomain(
    id: number,
    domainName: string
  ): Promise<[affectedCount: number]> {
    const domain = await Domain.findOne({
      where: {
        domain: domainName,
        active: true
      }
    })
    if (!domain) throw Errors.PLACEHOLDER
    return await User.update(
      {
        domainId: domain.id
      },
      {
        where: {
          id
        }
      }
    )
  }

  async sendFeedback(
    id: number,
    feedbackText: string,
    starRating: number,
    route: string
  ): Promise<void> {
    await Feedback.create({
      userId: id,
      feedbackText,
      starRating,
      route,
      debugInfo: "isTPUV2"
    })
  }
}
