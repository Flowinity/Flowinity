import { Response, NextFunction } from "express"
import { Service, Container } from "typedi"
import Router from "express-promise-router"
import { ChatService } from "@app/services/chat.service"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import Errors from "@app/lib/errors"
import { CoreService } from "@app/services/core.service"
import uploader from "@app/lib/upload"
import { GalleryService } from "@app/services/gallery.service"
import rateLimits from "@app/lib/rateLimits"

@Service()
export class ChatController {
  router: any

  constructor(
    private readonly chatService: ChatService,
    private readonly galleryService: GalleryService
  ) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    this.router.all(
      "*",
      auth("chats.view"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        const coreService = Container.get(CoreService)
        if (
          !(await coreService.checkExperiment(
            req.user.id,
            "COMMUNICATIONS",
            req.user.administrator || req.user.moderator,
            req.user.plan.internalName === "GOLD"
          ))
        ) {
          throw Errors.EXPERIMENT_NOT_ALLOWED
        } else {
          return next()
        }
      }
    )

    this.router.get(
      "/",
      auth("chats.view"),
      async (req: RequestAuth, res: Response) => {
        const chats = await this.chatService.getCachedUserChats(req.user.id)
        res.json(chats)
      }
    )

    this.router.post(
      "/",
      auth("chats.create"),
      rateLimits.uploadLimiterUser,
      async (req: RequestAuth, res: Response) => {
        const chat = await this.chatService.createChat(
          req.body.users,
          req.user.id
        )
        res.json(chat)
      }
    )

    this.router.post(
      "/:chatId/icon",
      auth("chats.edit"),
      rateLimits.uploadLimiterUser,
      uploader.single("icon"),
      async (req: any, res: Response) => {
        await this.chatService.getChatFromAssociation(
          parseInt(req.params.chatId),
          req.user.id
        )
        const upload = await this.galleryService.createUpload(
          req.user.id,
          req.file,
          false,
          false
        )
        await this.chatService.updateGroupSettings(
          parseInt(req.params.chatId),
          req.user.id,
          {
            icon: upload.upload.attachment
          }
        )
        res.json({
          icon: upload.upload.attachment
        })
      }
    )

    this.router.delete(
      "/:chatId/icon",
      auth("chats.edit"),
      async (req: RequestAuth, res: Response) => {
        await this.chatService.getChatFromAssociation(
          parseInt(req.params.chatId),
          req.user.id
        )
        await this.chatService.updateGroupSettings(
          parseInt(req.params.chatId),
          req.user.id,
          {
            icon: null
          }
        )
        res.sendStatus(204)
      }
    )

    this.router.delete(
      "/:chatId/association",
      auth("chats.edit"),
      async (req: RequestAuth, res: Response) => {
        await this.chatService.leaveGroupChat(
          parseInt(req.params.chatId),
          req.user.id
        )
        res.sendStatus(204)
      }
    )

    this.router.get(
      "/:chatId/search",
      auth("chats.view"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          const chat = await this.chatService.getChatFromAssociation(
            parseInt(req.params.chatId),
            req.user.id
          )
          if (!chat) throw Errors.CHAT_NOT_FOUND
          const messages = await this.chatService.searchChat(
            chat.id,
            <string>req.query.query,
            parseInt(<string>req.query.page || "0")
          )
          res.json(messages)
        } catch (e) {
          next(e)
        }
      }
    )

    this.router.delete(
      "/:chatId/messages/:messageId",
      auth("chats.send"),
      async (req: RequestAuth, res: Response) => {
        await this.chatService.deleteMessage(
          parseInt(req.params.messageId),
          req.user.id,
          parseInt(req.params.chatId)
        )
        res.sendStatus(204)
      }
    )

    this.router.patch(
      "/:chatId",
      auth("chats.edit"),
      async (req: RequestAuth, res: Response) => {
        await this.chatService.updateGroupSettings(
          parseInt(req.params.chatId),
          req.user.id,
          req.body
        )
        res.sendStatus(204)
      }
    )

    this.router.patch(
      "/association/:chatId",
      auth("chats.edit"),
      async (req: RequestAuth, res: Response) => {
        await this.chatService.updateAssociationSettings(
          parseInt(req.params.chatId),
          req.user.id,
          req.body
        )
        res.sendStatus(204)
      }
    )

    this.router.post(
      "/:chatId/users",
      auth("chats.create"),
      rateLimits.msgLimiter,
      async (req: RequestAuth, res: Response) => {
        await this.chatService.checkPermissions(
          req.user.id,
          parseInt(req.params.chatId),
          "admin"
        )
        const chat = await this.chatService.addUsersToChat(
          parseInt(req.params.chatId),
          req.body.users,
          req.user.id
        )
        res.json(chat)
      }
    )

    this.router.delete(
      "/:chatId/users/:userId",
      auth("chats.create"),
      async (req: RequestAuth, res: Response) => {
        const rank = await this.chatService.checkPermissions(
          req.user.id,
          parseInt(req.params.chatId),
          "admin"
        )
        await this.chatService.removeUserFromChat(
          parseInt(req.params.chatId),
          parseInt(req.params.userId),
          req.user.id,
          rank
        )
        res.sendStatus(204)
      }
    )

    this.router.put(
      "/:chatId/users/:userId",
      auth("chats.create"),
      async (req: RequestAuth, res: Response) => {
        const rank = await this.chatService.checkPermissions(
          req.user.id,
          parseInt(req.params.chatId),
          "admin"
        )
        if (rank !== "owner" && req.body.rank === "owner")
          throw Errors.PERMISSION_DENIED_RANK
        await this.chatService.updateUserRank(
          parseInt(req.params.userId),
          parseInt(req.params.chatId),
          req.body.rank,
          req.user.id
        )
        res.sendStatus(204)
      }
    )
    this.router.put(
      "/:chatId/message",
      auth("chats.edit"),
      async (req: RequestAuth, res: Response) => {
        const chat = await this.chatService.getChatFromAssociation(
          parseInt(req.params.chatId),
          req.user.id
        )
        if (!chat) throw Errors.CHAT_NOT_FOUND
        await this.chatService.editMessage(
          req.body.id,
          req.user.id,
          req.body.content,
          parseInt(req.params.chatId),
          req.body.pinned
        )
        res.sendStatus(204)
      }
    )

    this.router.put(
      "/:chatId/read",
      auth("chats.view"),
      async (req: RequestAuth, res: Response) => {
        await this.chatService.readChat(
          parseInt(req.params.chatId),
          req.user.id
        )
        res.sendStatus(204)
      }
    )

    this.router.get(
      "/:chatId/messages",
      auth("chats.view"),
      async (req: RequestAuth, res: Response) => {
        if (req.query.mode === "paginate") {
          const messages = await this.chatService.getMessagesPagination(
            parseInt(req.params.chatId),
            req.user.id,
            <"top" | "bottom">req.query.position || "top",
            <"pins" | "messages">req.query?.type || "messages",
            parseInt(<string>req.query?.page || "1")
          )
          res.json(messages)
          return
        }
        const messages = await this.chatService.getMessages(
          parseInt(req.params.chatId),
          req.user.id,
          <"top" | "bottom">req.query.position || "top",
          parseInt(<string>req.query?.offset || "0")
        )
        res.json(messages)
      }
    )

    this.router.post(
      "/:chatId/message",
      auth("chats.send"),
      rateLimits.msgLimiter,
      async (req: RequestAuth, res: Response) => {
        const message = await this.chatService.sendMessage(
          req.body.content,
          req.user.id,
          parseInt(req.params.chatId),
          req.body.replyId,
          "message",
          req.body.attachments
        )
        res.json(message)
      }
    )
  }
}
