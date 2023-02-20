import { Container, Service } from "typedi"
import { Chat } from "@app/models/chat.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { User } from "@app/models/user.model"
import { LegacyUser } from "@app/models/legacyUser.model"
import { Message } from "@app/models/message.model"
import Errors from "@app/lib/errors"
import { UserUtilsService } from "@app/services/userutils.service"
import { CacheService } from "@app/services/cache.service"
import embedParser from "@app/lib/embedParser"

interface ChatCache extends Chat {
  _redisSortDate: string
}

@Service()
export class ChatService {
  async editMessage(
    messageId: number,
    userId: number,
    content: string,
    associationId: number
  ) {
    const message = await Message.findOne({
      where: {
        id: messageId,
        userId
      }
    })
    if (!message) throw Errors.MESSAGE_NOT_FOUND
    const date = new Date()
    await Message.update(
      {
        content,
        edited: true,
        editedAt: date
      },
      {
        where: {
          id: messageId,
          userId
        }
      }
    )
    this.emitForAll(associationId, userId, "edit", {
      chatId: message.chatId,
      id: messageId,
      content,
      edited: true,
      editedAt: date,
      user: await Container.get(UserUtilsService).getUserById(userId)
    })
    return true
  }
  async emitForAll(
    associationId: number,
    userId: number,
    key: string,
    data: any
  ) {
    const chat = await this.getChatFromAssociation(associationId, userId)
    for (const user of chat.users) {
      socket.to(user.userId).emit(key, data)
    }
  }
  async readChat(associationId: number, userId: number) {
    const chat = await this.getChatFromAssociation(associationId, userId)
    const chatId = chat.id
    const notifications = await redis.json.get(
      `unread:${userId}`,
      `$.${chatId}`
    )
    if (notifications) {
      await redis.json.set(`unread:${userId}`, "$", {
        ...notifications,
        [chatId]: 0
      })
    } else {
      await redis.json.set(`unread:${userId}`, "$", {
        [chatId]: 0
      })
    }
    const message = await Message.findOne({
      where: {
        chatId
      },
      order: [["createdAt", "DESC"]]
    })
    if (message) {
      const association = await ChatAssociation.findOne({
        where: {
          chatId,
          userId
        }
      })
      if (!association || association.lastRead === message.id) return
      await association.update(
        { lastRead: message.id },
        {
          where: {
            chatId,
            userId
          }
        }
      )
      this.emitForAll(association.id, userId, "readReceipt", {
        chatId,
        lastRead: message.id,
        user: await Container.get(UserUtilsService).getUserById(userId)
      })
    }
  }
  async getChat(chatId: number, userId: number) {
    const chat = await Chat.findOne({
      where: { id: chatId },
      include: [
        {
          model: ChatAssociation,
          where: { userId },
          required: true,
          as: "association"
        },
        {
          model: ChatAssociation,
          as: "users",
          include: [
            {
              model: User,
              as: "tpuUser",
              attributes: ["id", "username", "avatar", "createdAt", "updatedAt"]
            },
            {
              model: LegacyUser,
              as: "legacyUser",
              attributes: ["id", "username", "createdAt", "updatedAt", "avatar"]
            }
          ]
        }
      ]
    })
    if (!chat) throw Errors.CHAT_NOT_FOUND
    return {
      ...chat.toJSON(),
      recipient: this.getRecipient(chat, userId)
    }
  }

  async createChat(users: number[], userId: number) {
    const userUtilsService = Container.get(UserUtilsService)
    const cacheService = Container.get(CacheService)
    if (!users.length || users.includes(userId))
      throw Errors.INVALID_FRIEND_SELECTION
    const friends = await userUtilsService.validateFriends(userId, users)
    const type = friends.length === 1 ? "direct" : "group"
    if (type === "direct") {
      const chats = await ChatAssociation.findAll({
        where: {
          userId
        },
        include: [
          {
            model: Chat,
            as: "chat",
            where: {
              type: "direct"
            },
            include: [
              {
                model: ChatAssociation,
                as: "users"
              }
            ]
          }
        ]
      })
      const chat = chats.find(
        (a: ChatAssociation) =>
          a.chat.users.length === 2 &&
          a.chat.users.find((u: ChatAssociation) => u.userId === users[0])
      )
      if (chat) {
        return this.getChat(chat.chatId, userId)
      }
    }

    const chat = await Chat.create({
      name: type === "group" ? "Unnamed Group" : "Direct Message",
      type,
      userId
    })
    let associations = []

    associations.push(
      await ChatAssociation.create({
        userId,
        chatId: chat.id,
        rank: "owner"
      })
    )

    for (const user of users) {
      associations.push(
        await ChatAssociation.create({
          userId: user,
          chatId: chat.id,
          rank: "member"
        })
      )
    }
    const chatWithUsers = await this.getChat(chat.id, userId)
    if (chatWithUsers) {
      cacheService.patchChatsCacheForUser(userId, chatWithUsers)
    }
    for (const association of associations) {
      const chatWithUsers = await this.getChat(chat.id, association.userId)
      if (!chatWithUsers) continue
      cacheService.patchChatsCacheForUser(association.userId, chatWithUsers)
      socket.to(association.userId).emit("chatCreated", chatWithUsers)
    }
    return chatWithUsers
  }
  async sendMessageToUsers(messageId: number, chat: Chat) {
    const message = await Message.findOne({
      where: { id: messageId },
      include: [
        {
          model: Message,
          as: "reply",
          include: [
            {
              model: User,
              as: "tpuUser",
              attributes: ["id", "username", "createdAt", "updatedAt", "avatar"]
            },
            {
              model: LegacyUser,
              as: "legacyUser",
              attributes: ["id", "username", "createdAt", "updatedAt", "avatar"]
            }
          ]
        },
        {
          model: User,
          as: "tpuUser",
          attributes: ["id", "username", "createdAt", "updatedAt", "avatar"]
        },
        {
          model: LegacyUser,
          as: "legacyUser",
          attributes: ["id", "username", "createdAt", "updatedAt", "avatar"]
        }
      ]
    })

    if (!message) throw Errors.UNKNOWN
    for (const { user } of chat.users.filter(
      (a: ChatAssociation) => a.userId !== message.userId && a.tpuUser
    )) {
      if (user) {
        socket.to(user.id).emit("message", {
          message,
          chat: {
            name: chat.name,
            id: chat.id,
            type: chat.type,
            recipient: this.getRecipient(chat, user.id)
          }
        })

        let notifications = await redis.json.get(`unread:${user.id}`)
        if (notifications) {
          notifications[chat.id] += 1 || 1
        } else {
          notifications = {
            [chat.id]: 1
          }
        }
        redis.json.set(`unread:${user.id}`, "$", notifications)
      }
    }

    return message
  }

  async sendMessage(
    content: string,
    userId: number,
    chatId: number,
    replyId?: number
  ) {
    const chat = await this.getChatFromAssociation(chatId, userId)
    if (replyId) {
      const message = await Message.findOne({
        where: {
          id: replyId,
          chatId: chat.id
        }
      })
      if (!message) throw Errors.REPLY_MESSAGE_NOT_FOUND
    }
    // must contain at least one character excluding spaces and newlines and must not contain just #s (one or more)
    if (!content.replace(/\s/g, "").length || !content.replace(/#/g, "").length)
      throw Errors.NO_MESSAGE_CONTENT
    const message = await Message.create({
      content,
      chatId: chat.id,
      userId,
      type: "message",
      replyId
    })

    redis.set(`chat:${chat.id}:sortDate`, dayjs(message.createdAt).valueOf())
    embedParser(message, message.chatId, userId, chatId)
    return await this.sendMessageToUsers(message.id, chat)
  }

  getRecipient(chat: Chat, userId: number) {
    const recipient =
      chat.type === "direct"
        ? chat.users.find((a: ChatAssociation) => a.userId !== userId)
        : null
    if (recipient) {
      return {
        ...recipient.user?.dataValues,
        legacyUser: !!recipient.legacyUser
      }
    } else {
      return null
    }
  }

  async getChatFromAssociation(associationId: number, userId: number) {
    const chats = await this.getCachedUserChats(userId)
    console.log(associationId)
    const chat = chats.find((c: Chat) => c.association?.id === associationId)
    if (!chat) throw Errors.CHAT_NOT_FOUND
    return chat
  }

  async getMessages(chatId: number, userId: number, offset?: number) {
    const chat = await this.getChatFromAssociation(chatId, userId)
    return await Message.findAll({
      where: { chatId: chat.id },
      order: [["createdAt", "DESC"]],
      limit: 50,
      offset,
      include: [
        {
          model: Message,
          as: "reply",
          include: [
            {
              model: User,
              as: "tpuUser",
              attributes: ["id", "username", "createdAt", "updatedAt", "avatar"]
            },
            {
              model: LegacyUser,
              as: "legacyUser",
              attributes: ["id", "username", "createdAt", "updatedAt", "avatar"]
            }
          ]
        },
        {
          model: ChatAssociation,
          as: "readReceipts",
          attributes: ["userId", "lastRead", "user"],
          include: [
            {
              model: User,
              as: "tpuUser",
              attributes: ["id", "username", "avatar", "createdAt", "updatedAt"]
            },
            {
              model: LegacyUser,
              as: "legacyUser",
              attributes: ["id", "username", "createdAt", "updatedAt", "avatar"]
            }
          ]
        },
        {
          model: User,
          as: "tpuUser",
          attributes: ["id", "username", "avatar", "createdAt", "updatedAt"]
        },
        {
          model: LegacyUser,
          as: "legacyUser",
          attributes: ["id", "username", "createdAt", "updatedAt", "avatar"]
        },
        {
          model: Message,
          as: "reply",
          include: [
            {
              model: User,
              as: "tpuUser",
              attributes: ["id", "username", "avatar", "createdAt", "updatedAt"]
            },
            {
              model: LegacyUser,
              as: "legacyUser",
              attributes: ["id", "username", "createdAt", "updatedAt", "avatar"]
            }
          ]
        }
      ]
    })
  }

  async getCachedUserChats(userId: number) {
    let chats = await redis.json.get(`chats:${userId}`)
    if (chats) {
      const start = new Date().getTime()
      for (const chat of chats) {
        chat._redisSortDate = await redis.get(`chat:${chat.id}:sortDate`)
      }

      const sorted = chats.sort((a: ChatCache, b: ChatCache) => {
        const aDate = parseInt(a._redisSortDate) || dayjs(a.createdAt).valueOf()
        const bDate = parseInt(b._redisSortDate) || dayjs(b.createdAt).valueOf()
        return bDate - aDate
      })
      const notifications = await redis.json.get(`unread:${userId}`)
      if (notifications) {
        for (const chat of sorted) {
          chat.unread = notifications[chat.id] || 0
        }
      } else {
        for (const chat of sorted) {
          chat.unread = 0
        }
      }
      const end = new Date().getTime()
      console.log("sorting took", end - start)
      return sorted
    } else {
      const chats = await this.getUserChats(userId)
      await redis.json.set(`chats:${userId}`, chats)
      return chats
    }
  }

  async getUserChats(userId: number) {
    const chats = await Chat.findAll({
      include: [
        {
          model: ChatAssociation,
          where: { userId },
          required: true,
          as: "association"
        },
        {
          model: ChatAssociation,
          as: "users",
          include: [
            {
              model: User,
              as: "tpuUser",
              attributes: ["id", "username", "avatar", "createdAt", "updatedAt"]
            },
            {
              model: LegacyUser,
              as: "legacyUser",
              attributes: ["id", "username", "createdAt", "updatedAt", "avatar"]
            }
          ]
        }
      ]
    })
    return chats.map((chat: Chat) => {
      return {
        ...chat.toJSON(),
        recipient: this.getRecipient(chat.toJSON(), userId)
      }
    })
    /* return chats.map((chat: Chat) => {
      const recipient =
        chat.type === "direct"
          ? chat.users
              .find((a: ChatAssociation) => a.userId !== userId)
              ?.toJSON()
          : null
      return {
        ...chat.toJSON(),
        recipient: recipient
          ? {
              ...(recipient.user || recipient.legacyUser),
              legacyUser: !!recipient.legacyUser
            }
          : null,
        users: chat.users.map((association: ChatAssociation) => {
          return {
            ...(association.user?.toJSON() || association.legacyUser?.toJSON()),
            legacyUser: !!association.legacyUser,
            association: association.toJSON()
          }
        })
      }
    })*/
  }
}
