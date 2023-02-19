import { Response, NextFunction } from "express"
import { Service, Container } from "typedi"
import Router from "express-promise-router"
import { ChatService } from "@app/services/chat.service"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import Errors from "@app/lib/errors"
import { CoreService } from "@app/services/core.service"

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
      async (req: RequestAuth, res: Response) => {
        const chat = await this.chatService.createChat(
          req.body.users,
          req.user.id
        )
        res.json(chat)
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
      async (req: RequestAuth, res: Response) => {
        const message = await this.chatService.sendMessage(
          req.body.content,
          req.user.id,
          parseInt(req.params.chatId),
          req.body.replyId
        )
        res.json(message)
      }
    )
  }
}
