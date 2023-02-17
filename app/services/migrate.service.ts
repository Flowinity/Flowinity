import { Service } from "typedi"
import { LegacyUser } from "@app/models/legacyUser.model"
import Errors from "@app/lib/errors"
import argon2 from "argon2"
import { Message } from "@app/models/message.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { MessageAttachment } from "@app/models/messageAttachment.model"
import { Chat } from "@app/models/chat.model"
@Service()
export class MigrateService {
  constructor() {}

  async colubrina(username: string, password: string, userId: number) {
    const user = await LegacyUser.findOne({
      where: {
        username
      },
      attributes: ["id", "username", "password"]
    })
    if (!user) {
      throw Errors.INVALID_CREDENTIALS
    }
    if (!(await argon2.verify(user.password, password))) {
      throw Errors.INVALID_CREDENTIALS
    }
    await ChatAssociation.update(
      {
        userId,
        legacyUserId: null
      },
      {
        where: {
          legacyUserId: user.id
        }
      }
    )
    await Message.update(
      {
        userId,
        legacyUserId: null
      },
      {
        where: {
          legacyUserId: user.id
        }
      }
    )
    await MessageAttachment.update(
      {
        userId,
        legacyUserId: null
      },
      {
        where: {
          legacyUserId: user.id
        }
      }
    )
    await Chat.update(
      {
        userId,
        legacyUserId: null
      },
      {
        where: {
          legacyUserId: user.id
        }
      }
    )
    await LegacyUser.destroy({
      where: {
        id: user.id
      }
    })
    return true
  }
}
