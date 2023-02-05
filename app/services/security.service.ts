import { Service } from "typedi"
import { Session } from "@app/models/session.model"
import Errors from "@app/lib/errors"
import utils from "@app/lib/utils"
import { Op } from "sequelize"
import { User } from "@app/models/user.model"
import argon2 from "argon2"

@Service()
export class SecurityService {
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
          "workspaces.modify"
        ]).includes(scope)
      ) {
        throw Errors.INVALID_SCOPES_PROVIDED
      }
    }
    if (password?.length < 8 || !scopes || !name) {
      throw Errors.INVALID_PARAMETERS
    }

    const user = await User.findOne({
      where: {
        id
      }
    })
    if (!user) {
      throw Errors.USER_NOT_FOUND
    }
    const alternatePasswords = user.alternatePasswords || []
    alternatePasswords.push({
      password: await argon2.hash(password),
      scopes: scopes.join(","),
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
    expiry: Date | null
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
          "workspaces.modify"
        ]).includes(scope)
      ) {
        throw Errors.INVALID_SCOPES_PROVIDED
      }
    }
    return await Session.create({
      userId: uid,
      name,
      scopes: scopes.join(","),
      expiry,
      type: "api",
      token: await utils.generateAPIKey("api")
    })
  }
}
