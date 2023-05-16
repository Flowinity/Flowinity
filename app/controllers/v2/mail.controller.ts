import { NextFunction, Response } from "express"
import { Container, Service } from "typedi"
import Router from "express-promise-router"
import { MailService } from "@app/services/mail.service"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import { CoreService } from "@app/services/core.service"
import Errors from "@app/lib/errors"

@Service()
export class MailController {
  router: any

  constructor(private readonly mailService: MailService) {
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
            "WEBMAIL",
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
      "/mailboxes",
      auth("email.view"),
      async (req: RequestAuth, res: Response) => {
        const mailboxes = await this.mailService.getMailboxes(req.user.id)
        res.json(mailboxes)
      }
    )
    this.router.get(
      "/mailbox/:mailbox/:page?",
      auth("email.view"),
      async (req: RequestAuth, res: Response) => {
        const messages = await this.mailService.getMessages(
          req.user.id,
          req.params.mailbox
        )
        res.json(messages)
      }
    )
    this.router.get(
      "/message/:mailbox/:uid",
      auth("email.view"),
      async (req: RequestAuth, res: Response) => {
        const message = await this.mailService.getMessage(
          req.user.id,
          req.params.mailbox,
          req.params.uid
        )
        res.json(message)
      }
    )
  }
}
