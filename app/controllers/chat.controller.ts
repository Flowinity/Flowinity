import { Response, NextFunction } from "express"
import { Service, Container } from "typedi"
import Router from "express-promise-router"
import { ChatService } from "@app/services/chat.service"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import Errors from "@app/lib/errors"
import { CoreService } from "@app/services/core.service"
import rateLimit from "express-rate-limit"

const msgLimiter = rateLimit({
  // Rate limiter configuration
  windowMs: 8 * 1000, // 8 seconds
  max: 8, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipFailedRequests: true, // Don't count failed requests (status >= 400) towards rate limiting
  keyGenerator: (req: RequestAuth) => req.user.id || req.ip, // Use the user ID if logged in, otherwise the IP address
  handler: (req: RequestAuth, res: Response) => {
    res.status(429).json({
      errors: [Errors.RATE_LIMITED]
    })
  }
})

@Service()
export class ChatController {
  router: any

  constructor(private readonly chatService: ChatService) {
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
            req.user.administrator || req.user.moderator
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
      msgLimiter,
      async (req: RequestAuth, res: Response) => {
        const chat = await this.chatService.createChat(
          req.body.users,
          req.user.id
        )
        res.json(chat)
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

    this.router.post(
      "/:chatId/users",
      auth("chats.create"),
      msgLimiter,
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
        try {
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
        } catch (e) {
          console.log(e)
        }
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
          parseInt(req.params.chatId)
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
        const messages = await this.chatService.getMessages(
          parseInt(req.params.chatId),
          req.user.id,
          parseInt(<string>req.query?.offset || "0")
        )
        res.json(messages)
      }
    )

    this.router.post(
      "/:chatId/message",
      auth("chats.send"),
      msgLimiter,
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
