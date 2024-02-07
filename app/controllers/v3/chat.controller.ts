import {
  Body,
  Delete,
  Get,
  HeaderParam,
  JsonController,
  Param,
  Patch,
  Post,
  Put,
  QueryParam,
  UploadedFile,
  UseBefore
} from "routing-controllers"
import { Service } from "typedi"
import { Auth } from "@app/lib/auth"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import { ChatService } from "@app/services/chat.service"
import { GalleryService } from "@app/services/gallery.service"
import rateLimits from "@app/lib/rateLimits"
import { uploaderSmall } from "@app/lib/upload"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { generateClientSatisfies } from "@app/lib/clientSatisfies"
import { ChatPermissions } from "@app/classes/graphql/chat/ranks/permissions"
import { ChatEmoji } from "@app/models/chatEmoji.model"
import { ChatAuditLog } from "@app/models/chatAuditLog.model"
import {
  AuditLogActionType,
  AuditLogCategory
} from "@app/classes/graphql/chat/auditLog/categories"
import { embedTranslator } from "@app/lib/embedParser"
import { Message } from "@app/models/message.model"

@Service()
@JsonController("/chats")
export class ChatControllerV3 {
  constructor(
    private readonly chatService: ChatService,
    private readonly galleryService: GalleryService
  ) {}

  @Get("")
  async getChats(
    @Auth("chats.view") user: User,
    @HeaderParam("X-TPU-Client") client: string,
    @HeaderParam("X-TPU-Client-Version") version: string
  ) {
    return await this.chatService.getSortedUserChats(
      user.id,
      undefined,
      generateClientSatisfies(client, version)
    )
  }

  @Post("")
  @UseBefore(rateLimits.uploadLimiterUser)
  async createChat(
    @Auth("chats.create") user: User,
    @Body() body: { users: number[] }
  ) {
    return await this.chatService.createChat(body.users, user.id)
  }

  slugify(str: string) {
    return String(str)
      .normalize("NFKD") // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-") // remove consecutive hyphens
  }

  @Post("/:chatId/icon")
  @UseBefore(rateLimits.uploadLimiterUser)
  async setChatIcon(
    @Auth("chats.edit") user: User,
    @UploadedFile("icon", {
      options: uploaderSmall
    })
    icon: Express.Multer.File,
    @Param("chatId") chatId: number,
    @QueryParam("type") type: "icon" | "background" | "emoji" = "icon"
  ) {
    if (type !== "icon" && type !== "background" && type !== "emoji") {
      throw Errors.INVALID_PARAMETERS
    }
    const chat = await this.chatService.getChatFromAssociation(
      chatId,
      user.id,
      false
    )
    const upload = await this.galleryService.createUpload(
      user.id,
      icon,
      false,
      false
    )

    if (type === "icon" || type === "background") {
      await this.chatService.updateGroupSettings(chatId, user.id, {
        [type]: upload.upload.attachment
      })
      return {
        [type]: upload.upload.attachment
      }
    } else if (type === "emoji") {
      const count = await ChatEmoji.count({
        where: {
          chatId: chat.id,
          deleted: false
        }
      })
      if (count >= 100) throw Errors.MAX_EMOJI
      const emoji = await ChatEmoji.create({
        chatId: chat.id,
        icon: upload.upload.attachment,
        userId: user.id,
        name: this.slugify(upload.upload.originalFilename.split(".")[0])
      })
      await ChatAuditLog.create({
        chatId: chat.id,
        userId: user.id,
        category: AuditLogCategory.EMOJI,
        actionType: AuditLogActionType.ADD,
        message: `<@${user.id}> added an emoji called **${emoji.name}**`
      })
      for (const user of chat.users) {
        redis.json.del(`emoji:${user.userId}`)
      }
      this.chatService.emitForAll(chatId, user.id, "emojiCreated", emoji)
      return emoji
    } else {
      throw Errors.INVALID_PARAMETERS
    }
  }
  @Delete("/:chatId/icon")
  async deleteChatIcon(
    @Auth("chats.edit") user: User,
    @Param("chatId") chatId: number
  ) {
    await this.chatService.getChatFromAssociation(chatId, user.id, false)
    await this.chatService.updateGroupSettings(chatId, user.id, {
      icon: null
    })
  }

  @Get("/:chatId/search")
  async searchChat(
    @Auth("chats.view") user: User,
    @Param("chatId") chatId: number,
    @QueryParam("query") query: string,
    @QueryParam("page") page: number
  ) {
    const chat = await this.chatService.getChatFromAssociation(
      chatId,
      user.id,
      false
    )
    if (!chat) throw Errors.CHAT_NOT_FOUND
    return await this.chatService.searchChat(chat.id, query, page)
  }

  @Delete("/:chatId/messages/:messageId")
  async deleteMessage(
    @Auth("chats.edit") user: User,
    @Param("chatId") chatId: number,
    @Param("messageId") messageId: number
  ) {
    await this.chatService.deleteMessage(messageId, user.id, chatId)
  }

  @Patch("/:associationId")
  async updateChat(
    @Auth("chats.edit") user: User,
    @Param("associationId") associationId: number,
    @Body() body: { name: string; icon: string }
  ) {
    await this.chatService.updateGroupSettings(associationId, user.id, {
      name: body.name,
      icon: body.icon
    })
  }

  @Patch("/association/:associationId")
  async updateChatAssociation(
    @Auth("chats.edit") user: User,
    @Param("associationId") associationId: number,
    @Body()
    body: { notifications: typeof ChatAssociation.prototype.notifications }
  ) {
    await this.chatService.updateAssociationSettings(
      associationId,
      user.id,
      body
    )
  }

  @Post("/:associationId/users")
  async addUsersToChat(
    @Auth("chats.edit") user: User,
    @Param("associationId") associationId: number,
    @Body() body: { users: number[] }
  ) {
    await this.chatService.checkPermissions(
      user.id,
      associationId,
      ChatPermissions.ADD_USERS
    )
    return await this.chatService.addUsersToChat(
      associationId,
      body.users,
      user.id
    )
  }

  @Delete("/:associationId/users/:userId")
  async removeUserFromChat(
    @Auth("chats.edit") user: User,
    @Param("associationId") associationId: number,
    @Param("userId") userId: number
  ) {
    const permissions = await this.chatService.checkPermissions(
      user.id,
      associationId,
      ChatPermissions.REMOVE_USERS
    )
    await this.chatService.removeUserFromChat(
      associationId,
      [userId],
      user.id,
      false,
      permissions
    )
  }

  @Put("/:associationId/message")
  async updateMessage(
    @Auth("chats.edit") user: User,
    @Param("associationId") associationId: number,
    @Body() body: { id: number; content: string; pinned: boolean }
  ) {
    const chat = await this.chatService.getChatFromAssociation(
      associationId,
      user.id,
      false
    )
    if (!chat) throw Errors.CHAT_NOT_FOUND
    await this.chatService.editMessage(
      body.id,
      user.id,
      body.content,
      associationId,
      body.pinned
    )
  }

  @Put("/:associationId/read")
  async readChat(
    @Auth("chats.view") user: User,
    @Param("associationId") associationId: number
  ) {
    await this.chatService.readChat(associationId, user.id)
  }

  @Get("/:associationId/messages")
  async getMessages(
    @Auth("chats.view") user: User,
    @Param("associationId") associationId: number,
    @HeaderParam("X-TPU-Client") client: string,
    @HeaderParam("X-TPU-Client-Version") version: string,
    @QueryParam("page") page?: number,
    @QueryParam("type") type?: "pins" | "messages",
    @QueryParam("mode") mode?: "paginate" | "infinite",
    @QueryParam("position") position?: "top" | "bottom",
    @QueryParam("offset") offset?: number
  ) {
    if (mode === "paginate") {
      const messages = await this.chatService.getMessagesPagination(
        associationId,
        user.id,
        position || "top",
        type || "messages",
        page || 1
      )

      // standardize the embeds
      messages.messages = messages.messages.map((message) => {
        if (!message.embeds?.length) return message as Message
        return {
          ...message.toJSON(),
          embeds: message.embeds.map((embed) => embedTranslator(embed))
        } as Message
      })

      return messages
    }
    let messages = await this.chatService.getMessages(
      associationId,
      user.id,
      position || "top",
      generateClientSatisfies(client, version),
      offset || 0
    )

    // standardize the embeds
    messages = messages.map((message) => {
      if (!message.embeds?.length) return message as Message
      return {
        ...message.toJSON(),
        embeds: message.embeds.map((embed) => embedTranslator(embed))
      } as Message
    })

    return messages
  }

  @UseBefore(rateLimits.msgLimiter)
  @Post("/:associationId/message")
  async sendMessage(
    @Auth("chats.send") user: User,
    @Param("associationId") associationId: number,
    @Body() body: { content: string; attachments: string[]; replyId?: number }
  ) {
    return await this.chatService.sendMessage(
      body.content,
      user.id,
      associationId,
      body.replyId,
      "message",
      body.attachments
    )
  }

  // Flowinity Kotlin
  // This is used to ensure that the direct message content isn't streamed to Google
  @Get("/messages/:messageId")
  async getMessage(
    @Auth("chats.view") user: User,
    @Param("messageId") messageId: number
  ) {
    const message = await Message.findOne({
      where: {
        id: messageId
      }
    })

    if (!message) throw Errors.MESSAGE_NOT_FOUND

    await this.chatService.getChat(message.chatId, user.id)

    return message
  }
}
