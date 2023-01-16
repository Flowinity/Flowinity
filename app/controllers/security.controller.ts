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
  }
}
