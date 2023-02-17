import { Response } from "express"
import { Service } from "typedi"
import Router from "express-promise-router"
import { ChatService } from "@app/services/chat.service"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"

@Service()
export class ChatController {
  router: any

  constructor(private readonly chatService: ChatService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    this.router.get(
      "/",
      auth("chats.view"),
      async (req: RequestAuth, res: Response) => {
        const chats = await this.chatService.getCachedUserChats(req.user.id)
        res.json(chats)
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
