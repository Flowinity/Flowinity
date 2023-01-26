import { UserUtilsService } from "@app/services/userutils.service"
import { Request, Response } from "express"
import { Service } from "typedi"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import Errors from "@app/lib/errors"
import Router from "express-promise-router"
import { AutoCollectCache } from "@app/types/collection"
const { Notification } = require("@app/models/notification.model")
@Service()
export class UserUtilsController {
  router: any

  constructor(private readonly userUtilsService: UserUtilsService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    /**
     * @swagger
     *
     * /api/v2/user:
     *   get:
     *     description: Return logged in user information.
     *     tags:
     *       - UserUtilsService
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     *       401:
     *         description: Unauthorized
     *     parameters:
     *         - in: header
     *           name: Authorization
     *           schema:
     *             type: string
     *             format: TPU-KEY
     *           required: true
     */
    this.router.get(
      "/",
      auth("user.view"),
      async (req: RequestAuth, res: Response) => {
        const pendingAutoCollects = await redis.json
          .get(`autoCollects:${req.user.id}`)
          .then((autoCollects: AutoCollectCache[]) => {
            if (!autoCollects?.length) return 0
            return autoCollects.reduce(
              (acc, curr) => acc + curr.autoCollectApprovals.length,
              0
            )
          })

        const notifications = await Notification.findAll({
          where: {
            userId: req.user.id
          },
          order: [["createdAt", "DESC"]],
          limit: 15
        })

        res.json({
          ...req.user.toJSON(),
          pendingAutoCollects,
          notifications
        })
      }
    )

    /**
     * @swagger
     *
     * /api/v2/user:
     *   patch:
     *     description: Sets all current notifications as read.
     *     tags:
     *       - UserUtilsService
     *     produces:
     *       - application/json
     *     responses:
     *       204:
     *         description: OK
     *     parameters:
     *         - in: header
     *           name: Authorization
     *           schema:
     *             type: string
     *             format: TPU-KEY
     *           required: true
     */
    this.router.patch(
      "/notifications",
      auth("user.modify"),
      async (req: RequestAuth, res: Response) => {
        await Notification.update(
          {
            dismissed: true
          },
          {
            where: {
              userId: req.user.id
            }
          }
        )
        res.sendStatus(204)
      }
    )

    this.router.post(
      "/friends/:id",
      auth("user.modify"),
      async (req: RequestAuth, res: Response) => {
        await this.userUtilsService.friend(req.user.id, parseInt(req.params.id))
        res.sendStatus(204)
      }
    )

    /**
     * @swagger
     *
     * /api/v2/user/all:
     *   get:
     *     description: All registered users.
     *     tags:
     *       - UserUtilsService
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     *       401:
     *         description: Unauthorized
     *     parameters:
     *         - in: header
     *           name: Authorization
     *           schema:
     *             type: string
     *             format: TPU-KEY
     *           required: true
     */
    this.router.get(
      "/all",
      auth("user.view"),
      async (req: Request, res: Response) => {
        res.json(await this.userUtilsService.getAllUsers())
      }
    )

    /**
     * @swagger
     *
     * /api/v2/user/profile/{username}:
     *   get:
     *     description: Get information about a user.
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
     *         - in: path
     *           name: username
     *           schema:
     *             type: string
     *           required: true
     */
    this.router.get(
      "/profile/:username",
      auth("user.view"),
      async (req: RequestAuth, res: Response) => {
        const user = await this.userUtilsService.getUser(
          req.params.username,
          req.user.id
        )
        if (user) {
          res.json(user)
        } else {
          throw Errors.USER_NOT_FOUND
        }
      }
    )

    /**
     * @swagger
     *
     * /api/v2/user/domain:
     *   patch:
     *     description: Set user domain.
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
     *         - in: body
     *           name: domain
     *           schema:
     *             type: string
     *           required: true
     */
    this.router.patch(
      "/domain",
      auth("user.modify"),
      async (req: RequestAuth, res: Response) => {
        await this.userUtilsService.setDefaultDomain(
          req.user.id,
          req.body.domain
        )
        res.sendStatus(204)
      }
    )

    this.router.post(
      "/feedback",
      auth("user.modify"),
      async (req: RequestAuth, res: Response) => {
        await this.userUtilsService.sendFeedback(
          req.user.id,
          req.body.text,
          req.body.starRating,
          req.body.route
        )
        res.sendStatus(204)
      }
    )

    this.router.patch(
      "/",
      auth("user.modify"),
      async (req: RequestAuth, res: Response) => {
        await this.userUtilsService.updateUser(req.user.id, req.body)
        res.sendStatus(204)
      }
    )

    this.router.patch(
      "/totp",
      auth("*"),
      async (req: RequestAuth, res: Response) => {
        switch (req.body.action) {
          case "enable":
            if (
              !(await this.userUtilsService.checkPassword(
                req.user.id,
                req.body.password
              ))
            ) {
              throw Errors.INVALID_CREDENTIALS
            }
            const response = await this.userUtilsService.enable2FA(req.user.id)
            return res.json(response)
          case "disable":
            if (
              !(await this.userUtilsService.checkPassword(
                req.user.id,
                req.body.password
              ))
            ) {
              throw Errors.INVALID_CREDENTIALS
            }
            await this.userUtilsService.act2FA(
              req.user.id,
              req.body.code,
              "disable"
            )
            return res.sendStatus(204)
          case "validate":
            await this.userUtilsService.act2FA(
              req.user.id,
              req.body.code,
              "validate"
            )
            return res.sendStatus(204)
          default:
            throw Errors.INVALID_PARAMETERS
        }
      }
    )
  }
}
