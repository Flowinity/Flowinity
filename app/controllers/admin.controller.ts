import { Response } from "express"
import { Service } from "typedi"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import Errors from "@app/lib/errors"
import Router from "express-promise-router"
import { AdminService } from "@app/services/admin.service"

export enum CacheType {
  "everything",
  "state",
  "collections",
  "sharelinks"
}

@Service()
export class AdminController {
  router: any

  constructor(private readonly adminService: AdminService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    this.router.all("*", auth("*"), async (req: RequestAuth, res: Response, next: any) => {
      if (!req.user.administrator) {
        throw Errors.ADMIN_ONLY
      }
      next()
    })

    /**
     * @swagger
     *
     * /api/v2/admin:
     *   get:
     *     description: Return statistics about the running TPU instance.
     *     tags:
     *       - AdminService
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
    this.router.get("/", auth("*"), async (req: RequestAuth, res: Response) => {
      const stats = await this.adminService.getStats()
      res.json(stats)
    })

    /**
     * @swagger
     *
     * /api/v2/admin/cache/:id:
     *   delete:
     *     description: Purge Redis cache for TPU instance.
     *     tags:
     *       - AdminService
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
    this.router.delete(["/cache/:id", "/cache/:id/:uid"], auth("*"), async (req: RequestAuth, res: Response) => {
      if (req.params.uid) {
        res.sendStatus(204)
        await this.adminService.purgeUserCache(parseInt(req.params.uid))
      } else {
        res.sendStatus(204)
        await this.adminService.purgeCache(parseInt(req.params.id) as CacheType)
      }
    })
  }
}
