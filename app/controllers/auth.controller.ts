import { AuthService } from "@app/services/auth.service"
import { Request, Response } from "express"
import { Service } from "typedi"
import Errors from "@app/lib/errors"
import Router from "express-promise-router"
//const HTTP_STATUS_CREATED = 201;

@Service()
export class AuthController {
  router: any

  constructor(private readonly authService: AuthService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    /**
     * @swagger
     *
     * /api/v2/auth/login:
     *   post:
     *     description: Generates TPU Web session.
     *     tags:
     *       - AuthService
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
    this.router.post("/login", async (req: Request, res: Response) => {
      if (!req.body.email || !req.body.password)
        throw Errors.INVALID_CREDENTIALS
      res.json(
        await this.authService.login(
          req.body.email,
          req.body.password,
          req.body.code
        )
      )
    })
  }
}
