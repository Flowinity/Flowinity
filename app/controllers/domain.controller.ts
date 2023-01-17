import { DomainService } from "@app/services/domain.service"
import { Response } from "express"
import { Service } from "typedi"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import Router from "express-promise-router"

@Service()
export class DomainController {
  router: any

  constructor(private readonly domainService: DomainService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    /**
     * @swagger
     *
     * /api/v2/domains:
     *   get:
     *     description: Return domains on TPU
     *     tags:
     *       - DomainService
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
    this.router.get("/", auth("user.view"), async (req: RequestAuth, res: Response) => {
      res.json(await this.domainService.getDomains())
    })
  }
}
