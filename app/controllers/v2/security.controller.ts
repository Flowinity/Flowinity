import { Response } from "express"
import { Service } from "typedi"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import Router from "express-promise-router"
import { SecurityService } from "@app/services/security.service"

@Service()
export class SecurityController {
  router: any

  constructor(private readonly securityService: SecurityService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    /**
     * @swagger
     *
     * /api/v2/security/keys:
     *   get:
     *     description: Return API keys for the given user.
     *     tags:
     *       - UserUtilsService
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     *     parameters:
     *         - in: header
     *           name: Authorization
     *           schema:
     *             type: string
     *             format: TPU-KEY
     *           required: true
     */
    this.router.get(
      "/keys",
      auth("*"),
      async (req: RequestAuth, res: Response) => {
        const keys = await this.securityService.getKeys(req.user.id)
        res.json(keys)
      }
    )

    this.router.delete(
      "/keys/:id",
      auth("*"),
      async (req: RequestAuth, res: Response) => {
        await this.securityService.deleteKey(req.user.id, req.params.id)
        res.sendStatus(204)
      }
    )

    this.router.post(
      "/keys",
      auth("*"),
      async (req: RequestAuth, res: Response) => {
        const key = await this.securityService.createKey(
          req.user.id,
          req.body.name,
          req.body.scopes,
          req.body.expiry
        )
        res.json(key)
      }
    )

    this.router.get(
      "/logins",
      auth("*"),
      async (req: RequestAuth, res: Response) => {
        const logins = await this.securityService.getSessions(req.user.id)
        res.json(logins)
      }
    )

    this.router.get(
      "/passwords",
      auth("*"),
      async (req: RequestAuth, res: Response) => {
        const passwords = await this.securityService.getAlternatePasswords(
          req.user.id
        )
        res.json(passwords)
      }
    )

    this.router.post(
      "/passwords",
      auth("*"),
      async (req: RequestAuth, res: Response) => {
        await this.securityService.createAlternatePassword(
          req.user.id,
          req.body.password,
          req.body.scopes,
          req.body.name,
          req.body.totp
        )
        res.sendStatus(204)
      }
    )

    this.router.patch(
      "/passwords",
      auth("*"),
      async (req: RequestAuth, res: Response) => {
        await this.securityService.deleteAlternatePassword(
          req.user.id,
          req.body.name
        )
        res.sendStatus(204)
      }
    )
  }
}
