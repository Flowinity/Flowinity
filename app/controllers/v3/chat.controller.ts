import {
  Body,
  Delete,
  Get,
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
import uploader from "@app/lib/upload"
import { ChatAssociation } from "@app/models/chatAssociation.model"

@Service()
@JsonController("/chats")
export class ChatControllerV3 {
  constructor(
    private readonly chatService: ChatService,
    private readonly galleryService: GalleryService
  ) {}

  @Get("")
  async getChats(@Auth("chats.view") user: User) {
    return await this.chatService.getCachedUserChats(user.id)
  }

  @Post("")
  @UseBefore(rateLimits.uploadLimiterUser)
  async createChat(
    @Auth("chats.create") user: User,
    @Body() body: { users: number[] }
  ) {
    return await this.chatService.createChat(body.users, user.id)
  }

  @Post("/:chatId/icon")
  @UseBefore(rateLimits.uploadLimiterUser)
  async setChatIcon(
    @Auth("chats.edit") user: User,
    @UploadedFile("icon", {
      options: uploader
    })
    icon: Express.Multer.File,
    @Param("chatId") chatId: number
  ) {
    await this.chatService.getChatFromAssociation(chatId, user.id)
    const upload = await this.galleryService.createUpload(
      user.id,
      icon,
      false,
      false
    )
    await this.chatService.updateGroupSettings(chatId, user.id, {
      icon: upload.upload.attachment
    })
    return {
      icon: upload.upload.attachment
    }
  }

  @Delete("/:chatId/icon")
  async deleteChatIcon(
    @Auth("chats.edit") user: User,
    @Param("chatId") chatId: number
  ) {
    await this.chatService.getChatFromAssociation(chatId, user.id)
    await this.chatService.updateGroupSettings(chatId, user.id, {
      icon: null
    })
  }

  @Delete("/:chatId/association")
  async leaveChat(
    @Auth("chats.edit") user: User,
    @Param("chatId") chatId: number
  ) {
    await this.chatService.leaveGroupChat(chatId, user.id)
  }

  @Get("/:chatId/search")
  async searchChat(
    @Auth("chats.view") user: User,
    @Param("chatId") chatId: number,
    @QueryParam("query") query: string,
    @QueryParam("page") page: number
  ) {
    const chat = await this.chatService.getChatFromAssociation(chatId, user.id)
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
    await this.chatService.updateGroupSettings(associationId, user.id, body)
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
    await this.chatService.checkPermissions(user.id, associationId, "admin")
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
    const rank = await this.chatService.checkPermissions(
      user.id,
      associationId,
      "admin"
    )
    await this.chatService.removeUserFromChat(
      associationId,
      userId,
      user.id,
      rank
    )
  }

  @Put("/:associationId/users/:userId")
  async updateUserRank(
    @Auth("chats.edit") user: User,
    @Param("associationId") associationId: number,
    @Param("userId") userId: number,
    @Body() body: { rank: "admin" | "member" | "owner" }
  ) {
    const rank = await this.chatService.checkPermissions(
      user.id,
      associationId,
      "admin"
    )
    if (rank !== "owner" && body.rank === "owner")
      throw Errors.PERMISSION_DENIED_RANK
    await this.chatService.updateUserRank(
      userId,
      associationId,
      body.rank,
      user.id
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
      user.id
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
    @QueryParam("page") page?: number,
    @QueryParam("type") type?: "pins" | "messages",
    @QueryParam("mode") mode?: "paginate" | "infinite",
    @QueryParam("position") position?: "top" | "bottom",
    @QueryParam("offset") offset?: number
  ) {
    if (mode === "paginate") {
      return await this.chatService.getMessagesPagination(
        associationId,
        user.id,
        position || "top",
        type || "messages",
        page || 1
      )
    }
    return await this.chatService.getMessages(
      associationId,
      user.id,
      position || "top",
      offset || 0
    )
  }

  @Post("/:associationId/message")
  async sendMessage(
    @Auth("chats.edit") user: User,
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
}
