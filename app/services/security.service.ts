import { Service } from "typedi"
import { Session } from "@app/models/session.model"
import Errors from "@app/lib/errors"
import utils from "@app/lib/utils"
import { Op } from "sequelize"
import { User } from "@app/models/user.model"
import argon2 from "argon2"
import { AlternatePassword } from "@app/types/auth"

@Service()
export class SecurityService {
  async deleteAlternatePassword(id: number, name: string) {
    const user = await User.findOne({
      where: {
        id
      },
      attributes: ["alternatePasswords", "id"]
    })
    if (!user) {
      throw Errors.USER_NOT_FOUND
    }
    const passwords = user.alternatePasswords || []
    const password = passwords.find((p) => p.name === name)
    if (!password) {
      throw Errors.INVALID_ALTERNATE_PASSWORD
    }
    const newPasswords = passwords.filter((p) => p.name !== name)
    await User.update(
      {
        alternatePasswords: newPasswords
      },
      {
        where: {
          id
        }
      }
    )
    return true
  }

  async createAlternatePassword(
    id: number,
    password: string,
    scopes: string[],
    name: string,
    totp: boolean = false
  ) {
    for (const scope of scopes) {
      if (
        !Object.values([
          "uploads.create",
          "uploads.modify",
          "uploads.view",
          "user.view",
          "user.modify",
          "collections.modify",
          "collections.create",
          "collections.view",
          "workspaces.view",
          "workspaces.create",
          "workspaces.modify",
          "platforms.colubrina",
          "chats.view",
          "chats.create",
          "chats.send",
          "chats.edit"
        ]).includes(scope)
      ) {
        throw Errors.INVALID_SCOPES_PROVIDED
      }
    }

    if (password?.length < 8) {
      throw Errors.PASSWORD_TOO_SHORT
    }

    if (!name) {
      throw Errors.NAME_FIELD
    }

    const user = await User.findOne({
      where: {
        id
      },
      attributes: ["alternatePasswords", "id", "username"]
    })
    if (!user) {
      throw Errors.USER_NOT_FOUND
    }
    const alternatePasswords = user.alternatePasswords || []
    if (alternatePasswords.length >= 10) {
      throw Errors.TOO_MANY_ALTERNATE_PASSWORDS
    }
    for (const password of alternatePasswords) {
      if (password.name === name) {
        throw Errors.ALTERNATE_PASSWORD_NAME_NOT_UNIQUE
      }
    }
    alternatePasswords.push({
      password: await argon2.hash(password),
      scopes: scopes ? scopes.join(",") : "",
      totp,
      name
    })
    await User.update(
      {
        alternatePasswords
      },
      {
        where: {
          id
        }
      }
    )
    return true
  }

  async getAlternatePasswords(id: number): Promise<AlternatePassword[]> {
    const user = await User.findOne({
      where: {
        id
      },
      attributes: ["alternatePasswords"]
    })

    if (!user) {
      throw Errors.USER_NOT_FOUND
    }
    if (!user.alternatePasswords) {
      await User.update(
        {
          alternatePasswords: []
        },
        {
          where: {
            id
          }
        }
      )
      return []
    }
    return user.alternatePasswords.map((password: AlternatePassword) => {
      return {
        ...password,
        password: ""
      }
    })
  }

  async getSessions(id: number): Promise<Session[]> {
    return await Session.findAll({
      where: {
        userId: id,
        type: "session",
        scopes: "*",
        expiredAt: {
          [Op.or]: [
            {
              [Op.gt]: new Date()
            },
            {
              [Op.is]: null
            }
          ]
        }
      },
      attributes: [
        "id",
        "name",
        "scopes",
        "expiredAt",
        "createdAt",
        "info",
        "updatedAt"
      ],
      order: [["updatedAt", "DESC"]]
    })
  }
  async getKeys(id: number): Promise<Session[]> {
    return await Session.findAll({
      where: {
        userId: id,
        type: "api"
      }
    })
  }

  async deleteKey(uid: number, sid: string): Promise<void> {
    await Session.destroy({
      where: {
        userId: uid,
        id: sid
      }
    })
  }

  async createKey(
    uid: number,
    name: string,
    scopes: string[],
    expiry: Date | null = null
  ): Promise<Session> {
    if (!scopes.length) {
      throw Errors.NO_SCOPES_PROVIDED
    }
    for (const scope of scopes) {
      if (
        !Object.values([
          "uploads.create",
          "uploads.modify",
          "uploads.view",
          "user.view",
          "user.modify",
          "collections.modify",
          "collections.create",
          "collections.view",
          "workspaces.view",
          "workspaces.create",
          "workspaces.modify",
          "chats.view",
          "chats.create",
          "chats.send",
          "chats.edit"
        ]).includes(scope)
      ) {
        throw Errors.INVALID_SCOPES_PROVIDED
      }
    }
    return await Session.create({
      userId: uid,
      name,
      scopes: scopes.join(","),
      type: "api",
      token: await utils.generateAPIKey("api")
    })
  }
}
