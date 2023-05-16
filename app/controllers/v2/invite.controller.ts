import { Request, Response } from "express"
import { Service } from "typedi"
import Router from "express-promise-router"
import { InviteService } from "@app/services/invite.service"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import rateLimits from "@app/lib/rateLimits"

@Service()
export class InviteController {
  router: any

  constructor(private readonly inviteService: InviteService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    this.router.get("/:inviteKey", async (req: Request, res: Response) => {
      res.json(await this.inviteService.getInviteCache(req.params.inviteKey))
    })

    this.router.post(
      "/",
      auth("user.view"),
      rateLimits.inviteLimiter,
      async (req: RequestAuth, res: Response) => {
        await this.inviteService.createInvite(req.user.id, req.body.email)
        res.sendStatus(204)
      }
    )
  }
}
