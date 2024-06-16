import { Container, Service } from "typedi"
import { Chat } from "@app/models/chat.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { User } from "@app/models/user.model"
import { Message } from "@app/models/message.model"
import Errors from "@app/lib/errors"
import { UserUtilsService } from "@app/services/userUtils.service"
import embedParser from "@app/lib/embedParser"
import { Includeable, Op } from "sequelize"
import paginate from "jw-paginate"
import axios from "axios"
import { ClientSatisfies } from "@app/lib/clientSatisfies"
import { partialUserBase } from "@app/classes/graphql/user/partialUser"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import { MessageSubscription } from "@app/classes/graphql/chat/messageSubscription"
import { ChatPermissionsHandler } from "@app/services/chat/permissions"
import { ChatPermissions } from "@app/classes/graphql/chat/ranks/permissions"
import { ChatRank } from "@app/models/chatRank.model"
import { ChatPermission } from "@app/models/chatPermission.model"
import { ChatRankAssociation } from "@app/models/chatRankAssociation.model"
import { GraphQLError } from "graphql/error"
import { GqlError } from "@app/lib/gqlErrors"
import { ChatEmoji } from "@app/models/chatEmoji.model"
import { ChatAuditLog } from "@app/models/chatAuditLog.model"
import {
  AuditLogActionType,
  AuditLogCategory
} from "@app/classes/graphql/chat/auditLog/categories"
import { Friend } from "@app/models/friend.model"
import { EmbedInput } from "@app/classes/graphql/chat/message"
import emojiData from "@app/lib/emoji.json"
import { pubSub } from "@app/lib/graphql/pubsub"
import { EmbedDataV2 } from "@app/classes/graphql/chat/embeds"
import { ReadReceipt } from "@app/classes/graphql/chat/readReceiptSubscription"
import { Platform, PlatformType } from "@app/classes/graphql/user/platforms"
import redisClient from "@app/redis"
import { ChatType } from "@app/classes/graphql/chat/createChat"

class MessageIncludes {
  constructor() {
    return [
      {
        model: Message,
        as: "reply",
        include: [
          {
            model: User,
            as: "user",
            attributes: partialUserBase
          }
        ]
      },
      {
        model: ChatAssociation,
        as: "readReceipts",
        attributes: ["userId", "lastRead"],
        include: [
          {
            model: User,
            as: "user",
            attributes: partialUserBase
          }
        ]
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "avatar", "username", "bot"]
      }
    ]
  }
}

@Service()
export class ChatService {
  private userIncludes = [
    {
      model: User,
      as: "user",
      attributes: partialUserBase
    }
  ]
  private chatIncludes: Includeable[] = [
    {
      model: ChatAssociation,
      as: "users",
      include: [
        {
          model: User,
          as: "user",
          attributes: partialUserBase
        }
      ],
      attributes: [
        "id",
        "userId",
        "rank",
        "lastRead",
        "createdAt",
        "hidden",
        "updatedAt"
      ],
      order: [
        ["rank", "DESC"],
        ["createdAt", "ASC"]
      ]
    }
  ]

  async normalizeIndexes(chatId: number, emit: boolean = true) {
    try {
      const normalized = []

      const ranks = await ChatRank.findAll({
        where: {
          chatId
        },
        order: [
          ["managed", "DESC"],
          ["index", "ASC"]
        ]
      })

      for (let i = 0; i < ranks.length; i++) {
        const rank = ranks[i]

        const normalizedIndex = Math.max(i, 0)

        await rank.update({ index: normalizedIndex })

        normalized.push({
          id: rank.id,
          index: normalizedIndex
        })
      }
      if (emit) {
        const chat = await Chat.findOne({
          where: { id: chatId },
          include: [
            {
              model: ChatAssociation,
              as: "users",
              attributes: [
                "id",
                "userId",
                "rank",
                "lastRead",
                "createdAt",
                "updatedAt"
              ]
            }
          ]
        })
        if (!chat) return false
        for (const user of chat.users) {
          if (!user.userId) continue
          await this.getPermissions(user.userId, user.id, true)
          socket
            .of(SocketNamespaces.CHAT)
            .to(user.userId)
            .emit("rankOrderUpdated", {
              chatId,
              ranks: normalized
            })
        }
      }
      return true
    } catch (error) {
      console.error("Error normalizing indexes:", error)
      throw error
    }
  }

  async syncPermissions(userId: number, associationId: number) {
    const permissions = await this.getPermissions(userId, associationId, true)
    socket.of(SocketNamespaces.CHAT).to(userId).emit("syncPermissions", {
      associationId,
      permissions,
      userId
    })
  }

  async getHighestIndex(chatAssociationId: number) {
    const rank = await ChatRankAssociation.findOne({
      where: {
        chatAssociationId
      },
      include: [
        {
          model: ChatRank,
          as: "rank"
        }
      ],
      order: [[{ model: ChatRank, as: "rank" }, "index", "DESC"]]
    })
    return rank?.rank?.index || 0
  }

  async getPermissions(
    userId: number,
    associationId: number,
    reset: boolean = false
  ): Promise<ChatPermissions[]> {
    let permissions = await redis.json.get(
      `chatPermissions:${userId}:${associationId}`
    )

    if (!permissions || reset) {
      const association = await ChatAssociation.findOne({
        where: { id: associationId, userId },
        include: [
          {
            model: Chat,
            attributes: ["userId", "type"],
            as: "chat"
          },
          {
            model: ChatRank,
            as: "ranks",
            include: [
              {
                model: ChatPermission,
                as: "permissions"
              }
            ]
          }
        ]
      })
      if (!association) return []
      permissions = [
        ...new Set(
          association.ranks.flatMap((rank) =>
            rank.permissions.map((permission) => permission.id)
          )
        )
      ]
      if (
        association.chat.userId === userId &&
        association.chat.type === "group"
      )
        permissions.push(ChatPermissions.OWNER)
      await redis.json.set(
        `chatPermissions:${userId}:${associationId}`,
        "$",
        permissions
      )
    }

    return permissions as ChatPermissions[]
  }

  async checkPermissions(
    userId: number,
    associationId: number,
    permission: ChatPermissions,
    noThrow: boolean = false
  ): Promise<ChatPermissions[]> {
    const permissions = await this.getPermissions(userId, associationId)
    // const date = new Date().getTime()
    // console.log(`took: ${new Date().getTime() - date}ms`)
    let hasPermission: boolean
    if (
      permission === ChatPermissions.OWNER ||
      permission === ChatPermissions.TRUSTED
    ) {
      hasPermission = permissions.includes(permission)
    } else {
      hasPermission =
        permissions.includes(permission) ||
        permissions.includes(ChatPermissions.ADMIN) ||
        permissions.includes(ChatPermissions.OWNER)
    }
    if (!noThrow && !hasPermission)
      throw new GraphQLError(
        "You do not have permission to perform this action on the group."
      )
    return permissions
  }

  async emitToFCMs(
    message: Message | undefined = undefined,
    chat: Chat,
    type: "message" | "read" = "message",
    individualAssociation?: ChatAssociation
  ) {
    if (!config.providers.google) return
    for (const user of individualAssociation
      ? [individualAssociation]
      : chat.users) {
      const key = await redisClient.get(`user:${user.userId}:notificationKey`)
      if (!key) continue

      // TODO: Implement proper idle states, and emit missed messages
      // const devices = (await redisClient.json.get(
      //   `user:${user.userId}:platforms`
      // )) as unknown as Platform[] | undefined
      //
      // if (
      //   devices?.find(
      //     (device) =>
      //       device.platform === PlatformType.WEB ||
      //       device.platform === PlatformType.DESKTOP
      //   ) &&
      //   type === "message"
      // )
      //   continue

      await axios
        .post(
          `https://fcm.googleapis.com/fcm/send`,
          {
            to: key,
            data:
              type === "message" && message
                ? {
                    content: "Please update your version of the Flowinity app.",
                    id: message.id,
                    associationId: user.id,
                    userId: message.userId,
                    username: message.user?.username || "Unknown",
                    avatar: message?.user?.avatar || null,
                    chatName: chat.name,
                    createdAt: message.createdAt,
                    type
                  }
                : {
                    content: "Please update your version of the Flowinity app.",
                    associationId: user.id,
                    type
                  }
          },
          {
            headers: {
              Authorization: `key=${config.providers.google.access_token}`,
              "Content-Type": "application/json"
            }
          }
        )
        .catch((e) => console.log(e?.response?.data))
    }
  }

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
    socket
      .of(SocketNamespaces.CHAT)
      .to(userId)
      .emit("chatUpdate", {
        id: association.chatId,
        association: {
          ...association.toJSON(),
          notifications: settings.notifications
        }
      })
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
    await this.sendMessage(
      `<@${userId}> left the chat`,
      userId,
      associationId,
      undefined,
      "leave",
      []
    )
    await ChatAssociation.destroy({
      where: {
        chatId: chat.id,
        userId
      }
    })
    if (user.rank === "owner") {
      const associations = await ChatAssociation.findAll({
        where: {
          chatId: chat.id,
          rank: "owner"
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
          return true
        }
        if (chat.type === "group") {
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
    }
    this.emitForAll(associationId, userId, "removeChatUser", {
      id: user.id,
      chatId: chat.id
    })
    socket.of(SocketNamespaces.CHAT).to(userId).emit("removeChat", {
      id: chat.id
    })
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
      include: new MessageIncludes(),
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
      await this.checkPermissions(
        userId,
        associationId,
        ChatPermissions.DELETE_MESSAGES
      )
      const message = await Message.findOne({
        where: {
          id: messageId,
          chatId: chat.id
        }
      })
      if (!message || message.type !== "message") throw Errors.MESSAGE_NOT_FOUND
      await message.destroy()
      this.emitForAll(
        associationId,
        userId,
        "messageDelete",
        {
          id: message.id,
          chatId: chat.id
        },
        false,
        4
      )
      this.emitForAll(
        associationId,
        userId,
        "messageDelete",
        {
          id: message.id,
          associationId: "__INJECT_ASSOC__",
          chatId: chat.id
        },
        false,
        5
      )
      return message
    } else {
      if (message.type !== "message") throw Errors.MESSAGE_NOT_FOUND
      await message.destroy()
      this.emitForAll(
        associationId,
        userId,
        "messageDelete",
        {
          id: message.id,
          chatId: chat.id
        },
        false,
        4
      )
      this.emitForAll(
        associationId,
        userId,
        "messageDelete",
        {
          id: message.id,
          associationId: "__INJECT_ASSOC__",
          chatId: chat.id
        },
        false,
        5
      )
      return message
    }
  }

  async updateGroupSettings(
    associationId: number,
    userId: number,
    settings: {
      name?: string | null
      icon?: string | null
      background?: string | null
    }
  ) {
    const chat = await this.getChatFromAssociation(associationId, userId)
    await this.checkPermissions(userId, associationId, ChatPermissions.OVERVIEW)
    await Chat.update(settings, {
      where: {
        id: chat.id
      }
    })
    if (settings.name !== chat.name && settings.name !== undefined) {
      await ChatAuditLog.create({
        chatId: chat.id,
        userId: userId,
        category: AuditLogCategory.SETTINGS,
        actionType: AuditLogActionType.MODIFY,
        message: `<@${userId}> updated the group's name from **${chat.name}** to **${settings.name}**`
      })
    }
    if (settings.icon !== undefined || settings.background !== undefined) {
      await ChatAuditLog.create({
        chatId: chat.id,
        userId: userId,
        category: AuditLogCategory.SETTINGS,
        actionType: AuditLogActionType.MODIFY,
        message: `<@${userId}> updated the group's **${
          settings.icon ? "icon" : "background"
        }**`
      })
    }
    this.emitForAll(associationId, userId, "chatUpdate", {
      name: settings.name ?? chat.name,
      id: chat.id,
      icon: settings.icon === undefined ? chat.icon : settings.icon,
      background:
        settings.background === undefined
          ? chat.background
          : settings.background
    })
    return chat
  }

  async removeUserFromChat(
    associationId: number,
    removeUserId: number[],
    userId: number,
    isLeaving: boolean = false,
    permissions: ChatPermissions[]
  ) {
    const chat = await this.getChatFromAssociation(associationId, userId)
    let removable = []
    const associations = await ChatAssociation.findAll({
      where: {
        chatId: chat.id,
        userId: removeUserId
      }
    })
    if (!isLeaving) {
      const myIndex = await this.getHighestIndex(associationId)
      for (const association of associations) {
        if (association.userId === chat.userId) continue
        const theirIndex = await this.getHighestIndex(association.id)
        if (
          ((theirIndex >= myIndex &&
            !permissions.includes(ChatPermissions.TRUSTED)) ||
            (theirIndex > myIndex &&
              permissions.includes(ChatPermissions.TRUSTED))) &&
          chat.userId !== userId
        )
          continue
        removable.push(association)
      }
    } else {
      removable.push(...associations)
    }
    if (!associations.length) throw Errors.CHAT_USER_NOT_FOUND
    for (const association of removable) {
      await redis.json.del(
        `chatPermissions:${association.userId}:${association.id}`
      )
      if (!isLeaving) {
        await this.sendMessage(
          `<@${userId}> removed <@${association.userId}> from the chat.`,
          userId,
          associationId,
          undefined,
          "leave"
        )
        await ChatAuditLog.create({
          chatId: chat.id,
          userId: userId,
          category: AuditLogCategory.USER,
          actionType: AuditLogActionType.REMOVE,
          message: `<@${userId}> removed <@${association.userId}> from the chat.`
        })
      } else {
        await this.sendMessage(
          `<@${userId}> left the chat.`,
          userId,
          associationId,
          undefined,
          "leave"
        )
        await ChatAuditLog.create({
          chatId: chat.id,
          userId: userId,
          category: AuditLogCategory.USER,
          actionType: AuditLogActionType.REMOVE,
          message: `<@${userId}> left the chat.`
        })
      }
      let unread: Record<string, string> = await redis.json.get(
        `unread:${association.userId}`
      )
      delete unread[chat.id.toString()]
      await redis.json.set(`unread:${association.userId}`, "$", unread)
      await this.emitForAll(associationId, userId, "removeChatUser", {
        chatId: chat.id,
        id: association.id
      })
      socket.of(SocketNamespaces.CHAT).to(removeUserId).emit("removeChat", {
        id: chat.id
      })
    }
    await ChatAssociation.destroy({
      where: {
        chatId: chat.id,
        id: removable.map((assoc) => assoc.id)
      }
    })
    for (const association of chat.users) {
      Container.get(UserUtilsService).trackedUserIds(association.userId, true)
    }
    return true
  }

  async addUsersToChat(
    associationId: number,
    userIds: number[],
    userId: number,
    force: boolean = false
  ) {
    let chat = await this.getChatFromAssociation(associationId, userId)
    const existingAssociations = await ChatAssociation.findAll({
      where: {
        chatId: chat.id,
        userId: userIds
      }
    })
    if (existingAssociations.length > 0) {
      throw Errors.USER_ALREADY_IN_CHAT
    }
    let friends: Friend[] = []
    if (!force) {
      friends = await Container.get(UserUtilsService).validateFriends(
        userId,
        userIds
      )
    }
    let newAssociations = []
    const rank = await ChatRank.findOne({
      where: {
        chatId: chat.id,
        managed: true
      }
    })
    if (!rank) throw Errors.COLUBRINA_CHAT
    for (const friend of force ? userIds : friends) {
      const id = typeof friend === "number" ? friend : friend.friendId
      const association = await ChatAssociation.create({
        chatId: chat.id,
        userId: id,
        rank: "member",
        identifier: chat.id + "-" + id
      })
      await ChatRankAssociation.create({
        rankId: rank.id,
        chatAssociationId: association.id
      })
      newAssociations.push(association.id)
      this.sendMessage(
        `<@${userId}> added <@${id}> to the chat.`,
        userId,
        associationId,
        undefined,
        "join"
      )
      await ChatAuditLog.create({
        chatId: chat.id,
        userId: userId,
        category: AuditLogCategory.USER,
        actionType: AuditLogActionType.ADD,
        message: `<@${userId}> added <@${id}> to the chat.`
      })
    }
    const associations = await ChatAssociation.findAll({
      where: {
        chatId: chat.id
      },
      include: this.userIncludes
    })
    for (const association of associations) {
      Container.get(UserUtilsService).trackedUserIds(association.userId, true)
    }
    const newUsers = await ChatAssociation.findAll({
      where: {
        id: newAssociations
      },
      include: [
        ...this.userIncludes,
        {
          model: ChatRank,
          as: "ranks"
        }
      ]
    })
    for (const user of newUsers) {
      user.dataValues.ranksMap = user.ranks.map((rank) => rank.id)
    }
    this.emitForAll(associationId, userId, "addChatUsers", {
      chatId: chat.id,
      users: newUsers
    })
    for (const association of newUsers) {
      socket
        .of(SocketNamespaces.CHAT)
        .to(association.userId)
        .emit("chatCreated", await this.getChat(chat.id, association.userId))
    }
    return associations
  }

  async typing(associationId: number, userId: number, isV5: boolean = false) {
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
      !isV5
    )
    return true
  }

  async cancelTyping(
    associationId: number,
    userId: number,
    isV5: boolean = false
  ) {
    const chat = await this.getChatFromAssociation(associationId, userId)
    await this.emitForAll(
      associationId,
      userId,
      "cancelTyping",
      {
        chatId: chat.id,
        userId,
        user: await Container.get(UserUtilsService).getUserById(userId)
      },
      !isV5
    )
    return true
  }

  async editMessage(
    messageId: number,
    userId: number,
    content: string,
    associationId: number,
    pinned?: boolean,
    embeds?: EmbedDataV2[],
    attachments?: string[]
  ) {
    const matches = content?.match(/:([\w~-]+)(?::([\w~-]+))?:/g)
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
      await this.checkPermissions(
        userId,
        associationId,
        ChatPermissions.PIN_MESSAGES
      )
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
      this.emitForAll(
        associationId,
        userId,
        "edit",
        {
          chatId: chat.id,
          id: messageId,
          user: await Container.get(UserUtilsService).getUserById(userId),
          pinned: !message.pinned,
          content: message.content,
          edited: message.edited,
          editedAt: message.editedAt,
          emoji: await ChatEmoji.findAll({
            where: {
              id: matches?.map((match) => match.split(":")[2]) || []
            }
          })
        },
        false,
        4
      )
      this.emitForAll(
        associationId,
        userId,
        "edit",
        {
          message: await Message.findByPk(messageId),
          associationId: "__INJECT_ASSOC__"
        },
        false,
        5
      )
      return true
    }
    if (message.userId !== userId) throw Errors.MESSAGE_NOT_FOUND
    if (!content?.trim()?.length && !attachments?.length)
      throw Errors.NO_MESSAGE_CONTENT
    const date = new Date()
    const update: {
      content: string
      edited: boolean
      editedAt: Date
      embeds?: EmbedDataV2[]
    } = {
      content,
      edited: true,
      editedAt: date
    }
    if (embeds) update.embeds = embeds
    await Message.update(update, {
      where: {
        id: messageId,
        userId
      }
    })
    this.emitForAll(
      associationId,
      userId,
      "edit",
      {
        chatId: message.chatId,
        id: messageId,
        content,
        edited: true,
        editedAt: date,
        user: await Container.get(UserUtilsService).getUserById(userId),
        pinned: message.pinned,
        emoji: await ChatEmoji.findAll({
          where: {
            id: matches?.map((match) => match.split(":")[2]) || []
          }
        })
      },
      false,
      4
    )
    this.emitForAll(
      associationId,
      userId,
      "edit",
      {
        message: await Message.findByPk(messageId),
        associationId: "__INJECT_ASSOC__"
      },
      false,
      5
    )
    message.content = content
    message.dataValues.content = content
    embedParser(message, message.chatId, userId, associationId, attachments)
    return true
  }

  async emitForAll(
    associationId: number,
    userId: number,
    key: string,
    data: any,
    excludeCreator = false,
    version: 0 | 4 | 5 = 0
  ) {
    let chat = await this.getChatFromAssociation(associationId, userId)
    if (excludeCreator) {
      chat.users = chat.users.filter(
        (u: ChatAssociation) => u.userId !== userId
      )
    }
    for (const user of chat.users) {
      const cData = { ...data }
      if (data) {
        for (const [key, value] of Object.entries(data)) {
          if (value === "__INJECT_ASSOC__") {
            cData[key] = user.id
          }
        }
      }
      if (!user.userId) continue
      if (version === 0 || version === 5) {
        // translate camelCase to SCREAMING_SNAKE_CASE and append :userId to the end
        let translated: string
        switch (key) {
          case "edit":
            translated = "EDIT_MESSAGE:" + user.userId
            break
          default:
            translated =
              key.replace(/([A-Z])/g, "_$1").toUpperCase() + ":" + user.userId
        }
        pubSub.publish(translated, cData)
      }

      if (version === 0 || version === 4) {
        socket.of(SocketNamespaces.CHAT).to(user.userId).emit(key, cData)
      }
    }
  }

  async readChat(associationId: number, userId: number) {
    try {
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
      socket.of(SocketNamespaces.CHAT).to(userId).emit("readChat", {
        id: chatId
      })
      pubSub.publish(`READ_CHAT:${userId}`, chatId)
      const message = await Message.findOne({
        where: {
          chatId
        },
        order: [["id", "DESC"]]
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
          attributes: [
            "id",
            "status",
            "storedStatus",
            "bot",
            "username",
            "avatar",
            "createdAt",
            "administrator",
            "moderator"
          ]
        })
        if (
          !association ||
          association.lastRead === message.id ||
          user?.storedStatus === "invisible" ||
          user?.bot
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
        if (!user) return
        this.emitForAll(
          association.id,
          userId,
          "readReceipt",
          {
            chatId,
            id: message.id,
            userId: user.id,
            lastRead: message.id,
            user: {
              id: user.id,
              username: user?.username,
              avatar: user?.avatar
            }
          },
          false,
          4
        )
        this.emitForAll(
          association.id,
          userId,
          "readReceipts",
          {
            messageId: message.id,
            associationId: "__INJECT_ASSOC__",
            user,
            chatId
          } as unknown as ReadReceipt,
          false,
          5
        )
        this.emitToFCMs(undefined, chat, "read", association)
      }
    } catch (e) {
      console.log(e)
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
          model: ChatRank,
          as: "ranks",
          order: [["index", "DESC"]]
        },
        {
          model: ChatAssociation,
          as: "users",
          include: [
            {
              model: ChatRank,
              as: "ranks",
              order: [["index", "DESC"]],
              include: [
                {
                  model: ChatPermission,
                  as: "permissions"
                }
              ]
            },
            {
              model: User,
              as: "user",
              attributes: partialUserBase
            }
          ],
          attributes: [
            "id",
            "userId",
            "rank",
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
    const recipient = await this.getRecipient(chat, userId)

    return {
      ...chat.toJSON(),
      users: chat.users.map((user) => {
        return {
          ...user.toJSON(),
          ranksMap: user.ranks.map((rank) => rank.id),
          permissions: [
            ...new Set(
              user.ranks.flatMap((rank) =>
                rank.permissions.map((permission) => permission.id)
              )
            )
          ]
        }
      }),
      ranks: chat.ranks
        .map((rank) => {
          return {
            ...rank.toJSON(),
            permissionsMap:
              rank?.permissions?.map((permission) => permission.id) || []
          }
        })
        .sort((a, b) => {
          return b.index - a.index || 0
        }),
      unread: 0,
      recipient: recipient,
      usersCount: await ChatAssociation.count({ where: { chatId: chat.id } })
    }
  }

  async createChat(
    users: number[],
    userId: number,
    gql?: boolean,
    type?: ChatType
  ) {
    const chatPermissionsHandler = new ChatPermissionsHandler()
    if (users.includes(userId))
      throw gql
        ? new GqlError("INVALID_FRIEND_SELECTION")
        : Errors.INVALID_FRIEND_SELECTION
    const userUtilsService = Container.get(UserUtilsService)
    const friends = await userUtilsService.validateFriends(userId, users)
    if (!type) type = friends.length === 1 ? ChatType.DIRECT : ChatType.GROUP
    const intent = [userId, ...users].sort((a, b) => a - b).join("-")
    if (type === ChatType.DIRECT) {
      const chat = await Chat.findOne({
        where: {
          type: "direct",
          intent
        },
        include: this.chatIncludes
      })
      const assoc = chat?.users.find(
        (u: ChatAssociation) => u.userId === userId
      )
      if (assoc && chat) {
        if (assoc.hidden) {
          assoc.update({
            hidden: false
          })
          const chatWithUsers = await this.getChat(chat.id, assoc.userId)
          socket
            .of(SocketNamespaces.CHAT)
            .to(assoc.userId)
            .emit("chatCreated", chatWithUsers)
        }
        return await this.getChat(chat.id, userId)
      } else if (chat) {
        const association = await ChatAssociation.create({
          userId,
          chatId: chat.id,
          rank: "member",
          identifier: chat.id + "-" + userId
        })
        let association2
        if (!chat.users.length) {
          association2 = await ChatAssociation.create({
            userId: users[0],
            chatId: chat.id,
            rank: "member",
            identifier: chat.id + "-" + users[0]
          })
        }
        const chatWithUsers = await this.getChat(chat.id, association.userId)
        socket
          .of(SocketNamespaces.CHAT)
          .to(association.userId)
          .emit("chatCreated", chatWithUsers)
        Container.get(UserUtilsService).trackedUserIds(association.userId, true)
        if (association2) {
          socket
            .of(SocketNamespaces.CHAT)
            .to(association2.userId)
            .emit("chatCreated", chatWithUsers)
          Container.get(UserUtilsService).trackedUserIds(
            association2.userId,
            true
          )
        }
        return chatWithUsers
      }
    }

    const chat = await Chat.create({
      name: type === "group" ? "Unnamed Group" : "Direct Message",
      type,
      userId,
      intent: type === "direct" ? intent : null
    })
    redis.set(`chat:${chat.id}:sortDate`, dayjs().valueOf())
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
    await chatPermissionsHandler.createDefaults(chatWithUsers)
    for (const association of associations) {
      const chatWithUsers = await this.getChat(chat.id, association.userId)
      if (!chatWithUsers) continue
      socket
        .of(SocketNamespaces.CHAT)
        .to(association.userId)
        .emit("chatCreated", chatWithUsers)
      Container.get(UserUtilsService).trackedUserIds(association.userId, true)
    }
    return chatWithUsers
  }

  async sendMessageToUsers(messageId: number, chat: Chat) {
    const message = await Message.findOne({
      where: { id: messageId },
      include: new MessageIncludes()
    })
    if (!message) throw Errors.UNKNOWN
    const matches = message.content.match(/:([\w~-]+)(?::([\w~-]+))?:/g)
    message.dataValues.emoji = await ChatEmoji.findAll({
      where: {
        id: matches?.map((match) => match.split(":")[2]) || []
      }
    })
    this.emitToFCMs(message, chat)
    for (const association of chat.users) {
      if (association?.user) {
        const assoc = await ChatAssociation.findOne({
          where: {
            id: association.id,
            userId: association.user.id
          },
          attributes: ["id", "notifications", "userId", "hidden"]
        })
        if (!assoc) continue
        if (assoc.hidden) {
          await assoc.update({
            hidden: false
          })
          const chatWithUsers = await this.getChat(chat.id, association.userId)
          if (!chatWithUsers) continue
          await socket
            .of(SocketNamespaces.CHAT)
            .to(assoc.userId)
            .emit("chatCreated", chatWithUsers)
        }
        const mention = message.content.includes(`<@${association.user.id}>`)
        const data = {
          message: {
            ...message.toJSON(),
            type: message.type.toUpperCase()
          },
          chat: {
            name: chat.name,
            id: chat.id,
            type: chat.type,
            recipient: await this.getRecipient(chat, association.user.id)
          },
          associationId: association.id,
          mention
        } as MessageSubscription
        console.log(`MESSAGES:${association.user.id}`)
        pubSub.publish(`MESSAGES:${association.user.id}`, {
          ...data,
          message: {
            ...data.message,
            type: message.type
          }
        })
        socket
          .of(SocketNamespaces.CHAT)
          .to(association.user.id)
          .emit("message", data)

        if (
          association.user.id === message.userId ||
          assoc.notifications === "none" ||
          (assoc.notifications === "mentions" && !mention)
        )
          continue

        let notifications = await redis.json.get(
          `unread:${association.user.id}`
        )
        if (notifications) {
          notifications[chat.id] += 1 || 1
        } else {
          notifications = {
            [chat.id]: 1
          }
        }
        redis.json.set(`unread:${association.user.id}`, "$", notifications)
      }
    }

    return message
  }

  async userEmoji(
    userId: number,
    reset: boolean = false
  ): Promise<ChatEmoji[]> {
    const cache = await redis.json.get(`emoji:${userId}`)
    if (cache && !reset) return cache
    const chats = await this.getUserChats(userId, {
      nameColor: false,
      uptime: false
    })
    const emoji = await ChatEmoji.findAll({
      where: {
        chatId: chats.map((chat) => chat.id),
        deleted: false
      },
      order: [["createdAt", "ASC"]]
    })

    // Handle duplicate names, this system will append ~offset onto them
    // For example, the oldest smiley will be :smiley: but subsequent will be
    // :smiley~1: / :smiley~2: / etc
    const emojiNameCount: Record<string, number> = {}

    for (const e of Object.keys(emojiData)) {
      emojiNameCount[e] = (emojiNameCount[e] || 0) + 1
    }

    for (const e of emoji) {
      const emojiName = e.name

      if (emojiNameCount.hasOwnProperty(emojiName)) {
        emojiNameCount[emojiName]++
        e.name = `${emojiName}~${emojiNameCount[emojiName]}`
      } else {
        emojiNameCount[emojiName] = 0
      }
    }

    await redis.json.set(`emoji:${userId}`, "$", emoji)
    return emoji
  }

  async sendMessage(
    content: string,
    userId: number,
    associationId: number,
    replyId?: number | null,
    type:
      | "message"
      | "leave"
      | "join"
      | "pin"
      | "administrator"
      | "rename"
      | "system" = "message",
    attachments?: string[],
    embeds?: EmbedInput[]
  ) {
    await this.checkPermissions(
      userId,
      associationId,
      ChatPermissions.SEND_MESSAGES
    )
    const chat = await this.getChatFromAssociation(associationId, userId)
    if (replyId !== undefined && replyId !== null) {
      const message = await Message.findOne({
        where: {
          id: replyId,
          chatId: chat.id
        }
      })
      if (!message) throw Errors.REPLY_MESSAGE_NOT_FOUND
    }
    // must contain at least one character excluding spaces and newlines and must not contain just #s (one or more)
    if (!attachments?.length && !embeds?.length) {
      content = content?.trim()
      if (
        !content.replace(/\s/g, "").length ||
        !content.replace(/#/g, "").length
      )
        throw Errors.NO_MESSAGE_CONTENT
    }
    if (content.length >= 4000) throw Errors.MESSAGE_TOO_LONG
    /*const emoji = await this.userEmoji(userId)
    for (const match of content.match(/:[\w-]+:\w+:/g) || []) {
      try {
        const find = emoji.find((e) => e.id === match.split(":")[2])
        if (!find) throw new GqlError("INVALID_EMOJI")
      } catch {
        throw new GqlError("INVALID_EMOJI")
      }
    }*/
    if (chat.type === "direct") {
      const userService = Container.get(UserUtilsService)
      const block = await userService.blocked(
        chat.users[0]?.userId,
        chat.users[1]?.userId
      )
      if (block) throw new GqlError("RESTRICTED_MESSAGING")
    }
    const message = await Message.create({
      content,
      chatId: chat.id,
      userId,
      type,
      replyId,
      embeds:
        embeds?.map((embed) => {
          return {
            data: embed,
            type: "bot",
            url: ""
          }
        }) || []
    })

    redis.set(`chat:${chat.id}:sortDate`, dayjs(message.createdAt).valueOf())
    embedParser(message, message.chatId, userId, associationId, attachments)
    return await this.sendMessageToUsers(message.id, chat)
  }

  async getRecipient(chat: Chat, userId: number) {
    if (chat.type !== "direct") return null
    const recipient = chat.users.find(
      (a: ChatAssociation) => a.userId !== userId
    )
    if (recipient) {
      return recipient?.user?.toJSON() || recipient?.user
    } else {
      const intent = chat.intent
        ?.split("-")
        .map((i: string) => parseInt(i))
        .filter((i: number) => i !== userId)
      if (intent?.length) {
        const user = await User.findOne({
          where: { id: intent[0] },
          attributes: [
            "id",
            "username",
            "avatar",
            "createdAt",
            "description",
            "administrator",
            "moderator"
          ]
        })
        if (!user) return null
        return user.toJSON()
      } else {
        return null
      }
    }
  }

  async getChatFromAssociation(
    associationId: number,
    userId: number,
    gql: boolean = true
  ) {
    const chat = await Chat.findOne({
      include: [
        {
          model: ChatAssociation,
          where: {
            id: associationId,
            userId
          },
          required: true,
          as: "association"
        },
        {
          model: ChatAssociation,
          as: "users",
          attributes: [
            "id",
            "userId",
            "rank",
            "lastRead",
            "createdAt",
            "updatedAt"
          ],
          include: [
            {
              model: User,
              as: "user",
              attributes: partialUserBase
            }
          ]
        }
      ]
    })
    if (!chat && gql)
      throw new GraphQLError("The chat could not be found.", {
        extensions: {
          code: "CHAT_NOT_FOUND"
        }
      })
    if (!chat) throw Errors.CHAT_NOT_FOUND
    return chat
  }

  async getMessages(
    chatId: number,
    userId: number,
    position: "top" | "bottom" = "top",
    clientSatisfies: ClientSatisfies,
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
      order: [["id", position === "top" ? "DESC" : "ASC"]],
      limit: 50,
      include: new MessageIncludes()
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
      include: new MessageIncludes()
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

  async getSortedUserChats(
    userId: number,
    internal = false,
    clientSatisfies: ClientSatisfies
  ) {
    let chats = await this.getUserChats(userId, clientSatisfies)
    if (internal) return chats
    const start = new Date().getTime()
    for (const chat of chats) {
      chat.dataValues._redisSortDate =
        (await redis.get(`chat:${chat.id}:sortDate`)) || "0"
      chat.dataValues.recipient = await this.getRecipient(chat, userId)
    }

    const sorted = chats.sort((a: Chat, b: Chat) => {
      const aDate = parseInt(a.dataValues._redisSortDate)
      const bDate = parseInt(b.dataValues._redisSortDate)
      return bDate - aDate
    })
    const notifications = await redis.json.get(`unread:${userId}`)
    if (notifications) {
      for (const chat of sorted) {
        chat.dataValues.unread = notifications[chat.id] || 0
      }
    } else {
      for (const chat of sorted) {
        chat.dataValues.unread = 0
      }
    }
    const end = new Date().getTime()
    console.log("sorting took", end - start)
    return sorted
  }

  async getUserChats(userId: number, clientSatisfies: ClientSatisfies) {
    return await Chat.findAll({
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
            "rank",
            "lastRead",
            "createdAt",
            "updatedAt"
          ],
          include: [
            {
              model: User,
              as: "user",
              attributes: [
                "id",
                "username",
                "avatar",
                "createdAt",
                "updatedAt",
                ...(clientSatisfies.nameColor ? ["nameColor"] : [])
              ]
            }
          ]
        }
      ]
    })
  }
}
