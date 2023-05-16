import { Container, Service } from "typedi"
import { LegacyUser } from "@app/models/legacyUser.model"
import Errors from "@app/lib/errors"
import argon2 from "argon2"
import { Message } from "@app/models/message.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { MessageAttachment } from "@app/models/messageAttachment.model"
import { Chat } from "@app/models/chat.model"
import { CacheService } from "@app/services/cache.service"
import { User } from "@app/models/user.model"

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
    const associations = await ChatAssociation.findAll({
      where: {
        legacyUserId: user.id
      }
    })
    for (const association of associations) {
      const userAssoc = await ChatAssociation.findOne({
        where: {
          chatId: association.chatId,
          userId
        }
      })
      if (!userAssoc) {
        await ChatAssociation.update(
          {
            userId,
            legacyUserId: null
          },
          {
            where: {
              id: association.id
            }
          }
        )
      } else {
        await ChatAssociation.destroy({
          where: {
            id: association.id,
            legacyUserId: user.id
          }
        })
      }
    }
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
    const chats = await Chat.findAll({
      where: {
        userId,
        type: "group"
      }
    })
    for (const chat of chats) {
      await ChatAssociation.update(
        {
          rank: "owner"
        },
        {
          where: {
            chatId: chat.id,
            userId
          }
        }
      )
    }
    await LegacyUser.destroy({
      where: {
        id: user.id
      }
    })
    const cacheService = Container.get(CacheService)
    await cacheService.generateChatsCache(userId)
    for (const chat of await Chat.findAll({
      where: {
        userId
      },
      include: [
        {
          model: ChatAssociation,
          as: "users",
          attributes: ["id", "userId", "chatId"],
          include: [
            {
              model: User,
              as: "tpuUser",
              attributes: ["id", "username", "avatar"]
            }
          ]
        }
      ]
    })) {
      for (const user of chat.users) {
        if (user.userId === userId) continue
        if (!user.tpuUser) continue
        await cacheService.generateChatsCache(user.tpuUser.id)
      }
    }
    return true
  }
}
