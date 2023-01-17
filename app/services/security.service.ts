import { Service } from "typedi"
import { Session } from "@app/models/session.model"
import Errors from "@app/lib/errors"
import utils from "@app/lib/utils"

@Service()
export class SecurityService {
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

  async createKey(uid: number, name: string, scopes: string[], expiry: Date | null): Promise<Session> {
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
          "collections.view"
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
