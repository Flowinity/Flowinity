import { Container, Service } from "typedi"
import { Chat } from "@app/models/chat.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { User } from "@app/models/user.model"
import { LegacyUser } from "@app/models/legacyUser.model"
import { Message } from "@app/models/message.model"
import Errors from "@app/lib/errors"
import { UserUtilsService } from "@app/services/userUtils.service"
import { CacheService } from "@app/services/cache.service"
import embedParser from "@app/lib/embedParser"
import { Op } from "sequelize"
import paginate from "jw-paginate"

interface ChatCache extends Chat {
  _redisSortDate: string
}

@Service()
export class ChatService {
  private userIncludes = [
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
  private messageIncludes = [
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
    }
  ]

  async updateAssociationSettings(
    associationId: number,
    userId: number,
    settings: {
      notifications: typeof ChatAssociation.prototype.notifications
    }
  ) {
    const association = await ChatAssociation.findOne({
      where: {
        id: associationId,
        userId
      }
    })
    if (!association) throw Errors.USER_NOT_FOUND
    await association.update({
      notifications: settings.notifications
    })
    socket.to(userId).emit("chatUpdate", {
      id: association.chatId,
      association: {
        ...association.toJSON(),
        notifications: settings.notifications
      }
    })
    const cache = Container.get(CacheService)
    await cache.patchChatsCacheForUser(
      userId,
      await this.getChat(association.chatId, userId)
    )
    return association
  }

  async leaveGroupChat(associationId: number, userId: number) {
    const chat = await this.getChatFromAssociation(associationId, userId)
    const user = await ChatAssociation.findOne({
      where: {
        chatId: chat.id,
        userId,
        id: associationId
      }
    })
    if (!user) throw Errors.USER_NOT_FOUND
    if (user.rank === "owner") {
      const associations = await ChatAssociation.findAll({
        where: {
          chatId: chat.id,
          rank: "owner"
        }
      })
      await ChatAssociation.destroy({
        where: {
          chatId: chat.id,
          userId
        }
      })
      if (associations.length === 1) {
        const association = await ChatAssociation.findOne({
          where: {
            chatId: chat.id,
            [Op.not]: [
              {
                userId
              }
            ]
          }
        })
        if (!association) {
          await Message.destroy({
            where: {
              chatId: chat.id
            }
          })
          await Chat.destroy({
            where: {
              id: chat.id
            }
          })
          await ChatAssociation.destroy({
            where: {
              chatId: chat.id
            }
          })
          await this.patchCacheForAll(chat.id, userId)
          return true
        }
        await ChatAssociation.update(
          {
            rank: "owner"
          },
          {
            where: {
              id: association.id
            }
          }
        )
        this.emitForAll(associationId, userId, "chatUserUpdate", {
          id: association.id,
          rank: "owner",
          chatId: chat.id
        })
      }
    }
    this.emitForAll(associationId, userId, "removeChatUser", {
      id: user.id,
      chatId: chat.id
    })
    socket.to(userId).emit("removeChat", {
      id: chat.id
    })
    await this.patchCacheForAll(chat.id, userId)
    return true
  }

  async searchChat(chatId: number, query: string, page: number = 1) {
    if (!page) page = 1
    const chat = await Chat.findOne({
      where: {
        id: chatId
      }
    })
    if (!chat) throw Errors.CHAT_NOT_FOUND
    const where = {
      chatId: chat.id,
      [Op.or]: [
        {
          content: {
            [Op.like]: `%${query}%`
          }
        },
        {
          embeds: {
            [Op.like]: `%${query}%`
          }
        }
      ]
    }
    const messages = await Message.findAll({
      order: [["createdAt", "DESC"]],
      where,
      include: this.messageIncludes,
      limit: 20,
      offset: (page - 1) * 20
    })
    const count = await Message.count({
      where
    })
    const pager = paginate(count, page, 20)
    return {
      messages,
      pager
    }
  }

  async updateUserRank(
    updatingUserId: number,
    associationId: number,
    rank: "owner" | "admin" | "member",
    userId: number
  ) {
    const chat = await this.getChatFromAssociation(associationId, userId)
    const user = await ChatAssociation.findOne({
      where: {
        chatId: chat.id,
        userId: updatingUserId
      }
    })
    if (!user) throw Errors.USER_NOT_FOUND
    if (user.rank === "owner") throw Errors.PERMISSION_DENIED_RANK
    if (user.rank === chat.association?.rank)
      throw Errors.PERMISSION_DENIED_RANK
    await ChatAssociation.update(
      {
        rank
      },
      {
        where: {
          chatId: chat.id,
          userId: updatingUserId
        }
      }
    )
    this.emitForAll(associationId, userId, "chatUserUpdate", {
      id: user.id,
      rank: rank,
      chatId: chat.id
    })
    this.patchCacheForAll(chat.id)
    return user
  }

  async deleteMessage(
    messageId: number,
    userId: number,
    associationId: number
  ) {
    const chat = await this.getChatFromAssociation(associationId, userId)
    const message = await Message.findOne({
      where: {
        id: messageId,
        userId,
        chatId: chat.id
      }
    })
    if (!message) {
      await this.checkPermissions(userId, associationId, "admin")
      const message = await Message.findOne({
        where: {
          id: messageId,
          chatId: chat.id
        }
      })
      if (!message || message.type !== "message") throw Errors.MESSAGE_NOT_FOUND
      await message.destroy()
      this.emitForAll(associationId, userId, "messageDelete", {
        id: message.id,
        chatId: chat.id
      })
      return message
    } else {
      if (message.type !== "message") throw Errors.MESSAGE_NOT_FOUND
      await message.destroy()
      this.emitForAll(associationId, userId, "messageDelete", {
        id: message.id,
        chatId: chat.id
      })
      return message
    }
  }

  async checkPermissions(
    userId: number,
    chatAssociationId: number,
    permission: "member" | "admin" | "owner"
  ) {
    const chat = await ChatAssociation.findOne({
      where: {
        id: chatAssociationId,
        userId
      }
    })
    console.log(chat?.rank)
    if (!chat) throw Errors.CHAT_NOT_FOUND
    if (chat.rank === "owner") return chat.rank
    if (chat.rank === "admin" && permission === "admin") return chat.rank
    if (chat.rank === "member" && permission === "member") return chat.rank
    if (chat.rank === "admin" && permission === "member") return chat.rank
    throw Errors.CHAT_INSUFFICIENT_PERMISSIONS
  }

  async updateGroupSettings(
    associationId: number,
    userId: number,
    settings: {
      name?: string
      icon?: string | null
    }
  ) {
    const chat = await this.getChatFromAssociation(associationId, userId)
    await this.checkPermissions(userId, associationId, "admin")
    await Chat.update(
      {
        name: settings.name,
        icon: settings.icon
      },
      {
        where: {
          id: chat.id
        }
      }
    )
    this.patchCacheForAll(chat.id)
    if (settings.name !== chat.name) {
      this.sendMessage(
        `<@${userId}> updated the chat name to ${settings.name}.`,
        userId,
        associationId,
        undefined,
        "rename",
        []
      )
    }
    if (settings.icon !== undefined) {
      this.sendMessage(
        `<@${userId}> updated the chat icon.`,
        userId,
        associationId,
        undefined,
        "system",
        []
      )
    }
    this.emitForAll(associationId, userId, "chatUpdate", {
      name: settings.name,
      id: chat.id,
      icon: settings.icon
    })
    return chat
  }

  async patchCacheForAll(chatId: number, removeUserId?: number) {
    const cache = Container.get(CacheService)
    const chat = await Chat.findOne({
      where: {
        id: chatId
      },
      include: [
        {
          model: ChatAssociation,
          as: "users",
          include: this.userIncludes
        }
      ]
    })
    if (!chat) throw Errors.CHAT_NOT_FOUND
    if (removeUserId) {
      await cache.generateChatsCache(removeUserId)
    }
    for (const user of chat.users) {
      if (!user.userId) continue
      await cache.patchChatsCacheForUser(user.userId, {
        ...chat.toJSON(),
        association: user.toJSON()
      } as ChatCache)
    }
  }

  async removeUserFromChat(
    chatId: number,
    removeUserId: number,
    userId: number,
    rank: "member" | "admin" | "owner"
  ) {
    const chat = await this.getChatFromAssociation(chatId, userId)
    const association = await ChatAssociation.findOne({
      where: {
        chatId: chat.id,
        userId: removeUserId,
        rank:
          rank === "owner"
            ? {
                [Op.or]: ["member", "admin", "owner"]
              }
            : "member"
      }
    })
    if (!association) throw Errors.CHAT_USER_NOT_FOUND
    if (association.rank === "owner") throw Errors.PERMISSION_DENIED_RANK
    await association.destroy()
    this.sendMessage(
      `<@${userId}> removed <@${removeUserId}> from the chat.`,
      userId,
      chatId,
      undefined,
      "leave"
    )
    this.patchCacheForAll(chat.id, removeUserId)
    this.emitForAll(chatId, userId, "removeChatUser", {
      chatId: chat.id,
      id: association.id
    })
    socket.to(removeUserId).emit("removeChat", {
      id: chat.id
    })
    return true
  }

  async addUsersToChat(chatId: number, userIds: number[], userId: number) {
    let chat = await this.getChatFromAssociation(chatId, userId)
    const existingAssociations = await ChatAssociation.findAll({
      where: {
        chatId: chat.id,
        userId: userIds
      }
    })
    if (existingAssociations.length > 0) {
      throw Errors.USER_ALREADY_IN_CHAT
    }
    const friends = await Container.get(UserUtilsService).validateFriends(
      userId,
      userIds
    )
    let newAssociations = []
    for (const friend of friends) {
      const association = await ChatAssociation.create({
        chatId: chat.id,
        userId: friend.friendId,
        rank: "member",
        identifier: chat.id + "-" + friend.friendId
      })
      newAssociations.push(association.id)
      this.sendMessage(
        `<@${userId}> added <@${friend.friendId}> to the chat.`,
        userId,
        chatId,
        undefined,
        "join"
      )
    }
    const associations = await ChatAssociation.findAll({
      where: {
        chatId: chat.id
      },
      include: this.userIncludes
    })
    this.patchCacheForAll(chat.id)
    this.emitForAll(chatId, userId, "addChatUsers", {
      chatId: chat.id,
      users: await ChatAssociation.findAll({
        where: {
          id: newAssociations
        },
        include: this.userIncludes
      })
    })
    return associations
  }

  async typing(associationId: number, userId: number) {
    const chat = await this.getChatFromAssociation(associationId, userId)
    await this.emitForAll(
      associationId,
      userId,
      "typing",
      {
        chatId: chat.id,
        userId,
        user: await Container.get(UserUtilsService).getUserById(userId),
        expires: Date.now() + 5000
      },
      true
    )
    return true
  }

  async editMessage(
    messageId: number,
    userId: number,
    content: string,
    associationId: number,
    pinned?: boolean
  ) {
    const chat = await this.getChatFromAssociation(associationId, userId)
    if (!chat) throw Errors.CHAT_NOT_FOUND
    const message = await Message.findOne({
      where: {
        id: messageId,
        chatId: chat.id
      }
    })
    if (!message || message.type !== "message") throw Errors.MESSAGE_NOT_FOUND
    if (pinned !== undefined) {
      await this.checkPermissions(userId, associationId, "admin")
      await Message.update(
        {
          pinned: !message.pinned
        },
        {
          where: {
            id: messageId
          }
        }
      )
      this.sendMessage(
        `<@${userId}> ${message.pinned ? "unpinned" : "pinned"} a message.`,
        userId,
        associationId,
        messageId,
        "pin",
        []
      )
      this.emitForAll(associationId, userId, "edit", {
        chatId: chat.id,
        id: messageId,
        user: await Container.get(UserUtilsService).getUserById(userId),
        pinned: !message.pinned
      })
      return true
    }
    if (message.userId !== userId) throw Errors.MESSAGE_NOT_FOUND
    if (!content?.trim()?.length) throw Errors.NO_MESSAGE_CONTENT
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
    data: any,
    excludeCreator = false
  ) {
    let chat = await this.getChatFromAssociation(associationId, userId)
    if (excludeCreator) {
      chat.users = chat.users.filter(
        (u: ChatAssociation) => u.userId !== userId
      )
    }
    for (const user of chat.users) {
      if (!user.userId) continue
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
    socket.to(userId).emit("readChat", {
      id: chatId
    })
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
      const user = await User.findOne({
        where: {
          id: userId
        },
        attributes: ["id", "status", "storedStatus"]
      })
      if (
        !association ||
        association.lastRead === message.id ||
        user?.storedStatus === "invisible"
      )
        return
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
        id: message.id,
        user: await Container.get(UserUtilsService).getUserById(userId),
        lastRead: message.id
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
          ],
          attributes: [
            "id",
            "userId",
            "rank",
            "legacyUserId",
            "user",
            "lastRead",
            "createdAt",
            "updatedAt"
          ],
          order: [
            ["rank", "DESC"],
            ["createdAt", "ASC"]
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
        rank: type === "direct" ? "member" : "owner",
        identifier: chat.id + "-" + userId
      })
    )

    for (const user of users) {
      associations.push(
        await ChatAssociation.create({
          userId: user,
          chatId: chat.id,
          rank: "member",
          identifier: chat.id + "-" + user
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
      include: this.messageIncludes
    })

    if (!message) throw Errors.UNKNOWN
    for (const association of chat.users) {
      if (association?.tpuUser) {
        const assoc = await ChatAssociation.findOne({
          where: {
            id: association.id,
            userId: association.tpuUser.id
          },
          attributes: ["id", "notifications"]
        })
        if (!assoc) continue
        const mention = message.content.includes(`<@${association.tpuUser.id}>`)
        socket.to(association.tpuUser.id).emit("message", {
          message,
          chat: {
            name: chat.name,
            id: chat.id,
            type: chat.type,
            recipient: this.getRecipient(chat, association.user.id)
          },
          association: {
            id: association.id,
            rank: association.rank
          },
          mention
        })

        if (
          association.tpuUser.id === message.userId ||
          assoc.notifications === "none" ||
          (assoc.notifications === "mentions" && !mention)
        )
          continue

        let notifications = await redis.json.get(
          `unread:${association.tpuUser.id}`
        )
        if (notifications) {
          notifications[chat.id] += 1 || 1
        } else {
          notifications = {
            [chat.id]: 1
          }
        }
        redis.json.set(`unread:${association.tpuUser.id}`, "$", notifications)
      }
    }

    return message
  }

  async sendMessage(
    content: string,
    userId: number,
    associationId: number,
    replyId?: number,
    type:
      | "message"
      | "leave"
      | "join"
      | "pin"
      | "administrator"
      | "rename"
      | "system" = "message",
    attachments?: string[]
  ) {
    const chat = await this.getChatFromAssociation(associationId, userId)
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
    if (!attachments?.length) {
      content = content.trim()
      if (
        !content.replace(/\s/g, "").length ||
        !content.replace(/#/g, "").length
      )
        throw Errors.NO_MESSAGE_CONTENT
    }
    const message = await Message.create({
      content,
      chatId: chat.id,
      userId,
      type,
      replyId
    })

    redis.set(`chat:${chat.id}:sortDate`, dayjs(message.createdAt).valueOf())
    embedParser(message, message.chatId, userId, associationId, attachments)
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
    const chats = await this.getCachedUserChats(userId, true)
    const chat = chats.find((c: Chat) => c.association?.id === associationId)
    if (!chat) throw Errors.CHAT_NOT_FOUND
    return chat
  }

  async getMessages(
    chatId: number,
    userId: number,
    position: "top" | "bottom" = "top",
    offset?: number
  ) {
    const chat = await this.getChatFromAssociation(chatId, userId)
    let where = offset
      ? position === "top"
        ? { id: { [Op.lt]: offset } }
        : { id: { [Op.gt]: offset } }
      : {}
    let messages = await Message.findAll({
      where: {
        chatId: chat.id,
        ...where
      },
      order: [["createdAt", position === "top" ? "DESC" : "ASC"]],
      limit: 50,
      include: this.messageIncludes
    })
    if (position === "bottom") messages.reverse()
    return messages
  }

  async getMessagesPagination(
    chatId: number,
    userId: number,
    position: "top" | "bottom" = "top",
    type: "pins" | "messages" = "messages",
    page: number = 1
  ) {
    const chat = await this.getChatFromAssociation(chatId, userId)
    let messages = await Message.findAll({
      where: {
        chatId: chat.id,
        ...(type === "pins" ? { pinned: true } : {})
      },
      order: [["createdAt", position === "top" ? "DESC" : "ASC"]],
      limit: 50,
      include: this.messageIncludes
    })
    if (position === "bottom") messages.reverse()
    const count = await Message.count({
      where: {
        chatId: chat.id,
        ...(type === "pins" ? { pinned: true } : {})
      }
    })
    const pager = paginate(count, page, 50)
    return {
      messages,
      pager
    }
  }

  async getCachedUserChats(userId: number, internal = false) {
    let chats = await redis.json.get(`chats:${userId}`)
    if (chats) {
      if (internal) return chats
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
          attributes: [
            "id",
            "userId",
            "user",
            "rank",
            "legacyUserId",
            "lastRead",
            "createdAt",
            "updatedAt"
          ],
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
