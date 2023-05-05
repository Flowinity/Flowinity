import { Response } from "express"
import { Service } from "typedi"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import Router from "express-promise-router"
import { ProviderService } from "@app/services/provider.service"
import Errors from "@app/lib/errors"
import { AxiosStatic } from "axios"
import { Integration } from "@app/models/integration.model"
import { User } from "@app/models/user.model"

@Service()
export class ProviderController {
  router: any
  constructor(private readonly providerService: ProviderService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    this.router.get(
      "/tenor",
      auth("chats.view"),
      async (req: RequestAuth, res: Response) => {
        if (!req.query.search) throw Errors.INVALID_SEARCH
        const tenor = await this.providerService.tenor(
          <string>req.query.search,
          <string>req.query.next
        )
        res.json(tenor)
      }
    )

    this.router.get("/linkable", async (req: RequestAuth, res: Response) => {
      res.json([
        {
          name: "Last.fm",
          id: "lastfm",
          key: config.providers.lastfm.key
        }
      ])
    })

    this.router.get(
      ["/link/lastfm", "/link/last-fm"],
      auth("user.modify"),
      async (req: RequestAuth, res: Response) => {
        const existing = await Integration.findOne({
          where: {
            userId: req.user.id,
            type: "lastfm"
          }
        })
        if (existing) throw Errors.INTEGRATION_EXISTS
        await this.providerService.linkLastFM(
          req.user.id,
          <string>req.query.token
        )
        res.sendStatus(204)
      }
    )

    this.router.get(
      "/userv3/lastfm/:username",
      auth("user.view"),
      async (req: RequestAuth, res: Response) => {
        const user = await User.findOne({
          where: {
            username: req.params.username
          },
          include: [
            {
              model: Integration,
              required: true,
              where: {
                type: "lastfm"
              }
            }
          ]
        })
        if (
          !user?.profileLayout?.layout.columns[0].rows.find(
            (row) => row.name === "last-fm"
          )
        )
          throw Errors.USER_NOT_FOUND
        res.json(
          await this.providerService.getLastFMOverview(
            user.id,
            user.integrations[0].providerUsername,
            user.integrations[0].accessToken
          )
        )
      }
    )
  }
}
