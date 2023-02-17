import { Service } from "typedi"
import { Chat } from "@app/models/chat.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { User } from "@app/models/user.model"
import { LegacyUser } from "@app/models/legacyUser.model"
import { Message } from "@app/models/message.model"
import Errors from "@app/lib/errors"

@Service()
export class ChatService {
  async sendMessageToUsers(messageId: number, chat: Chat) {
    const message = await Message.findOne({
      where: { id: messageId },
      include: [
        {
          model: User,
          as: "tpuUser",
          attributes: ["id", "username", "createdAt", "updatedAt", "avatar"]
        },
        {
          model: LegacyUser,
          as: "legacyUser",
          attributes: ["id", "username", "createdAt", "updatedAt"]
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

    const message = await Message.create({
      content,
      chatId: chat.id,
      userId,
      type: "message",
      replyId
    })

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
    const chat = chats.find((c: Chat) => c.association?.id === associationId)
    if (!chat) throw Errors.CHAT_NOT_FOUND
    return chat
  }

  async getMessages(chatId: number, userId: number, offset?: number) {
    const chat = await this.getChatFromAssociation(chatId, userId)
    const messages = await Message.findAll({
      where: { chatId: chat.id },
      order: [["createdAt", "DESC"]],
      limit: 50,
      offset,
      include: [
        {
          model: User,
          as: "tpuUser",
          attributes: ["id", "username", "avatar", "createdAt", "updatedAt"]
        },
        {
          model: LegacyUser,
          as: "legacyUser",
          attributes: ["id", "username", "createdAt", "updatedAt"]
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
              attributes: ["id", "username", "createdAt", "updatedAt"]
            }
          ]
        }
      ]
    })

    return messages.sort((a, b) => a.id - b.id)
  }

  async getCachedUserChats(userId: number) {
    const chats = await redis.json.get(`chats:${userId}`)
    if (chats) {
      return chats
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
              attributes: ["id", "username", "createdAt", "updatedAt"]
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
