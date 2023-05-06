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
import cryptoRandomString from "crypto-random-string"
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

    this.router.get(
      "/linkable",
      auth("user.view", true),
      async (req: RequestAuth, res: Response) => {
        const malCodeChallenge = cryptoRandomString({ length: 128 })
        if (req.user) {
          await redis.set(
            `providers:mal:${req.user.id}:code_challenge`,
            malCodeChallenge,
            { EX: 3600 }
          )
        }
        res.json([
          {
            name: "Last.fm",
            id: "lastfm",
            key: config.providers.lastfm.key,
            url: `https://www.last.fm/api/auth/?api_key=${config.providers.lastfm.key}`,
            shortText: "Last.fm",
            color: "red",
            available: true
          },
          {
            name: "MyAnimeList",
            id: "mal",
            key: config.providers.mal.key,
            url: `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${config.providers.mal.key}&code_challenge=${malCodeChallenge}&grant_type=authorization_code`,
            shortText: "MAL",
            color: "#2e51a2",
            available: true
          },
          {
            id: "discord",
            name: "Discord",
            shortText: "Discord",
            color: "#7289DA",
            url: null,
            available: false
          },
          {
            id: "anilist",
            name: "AniList",
            shortText: "AniList",
            color: "#2e51a2",
            url: null,
            available: false
          },
          {
            id: "spotify",
            name: "Spotify",
            shortText: "Spotify",
            color: "#1DB954",
            url: null,
            available: false
          }
        ])
      }
    )

    // LAST.FM
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
        const user = await this.providerService.verifyUser(
          req.params.username,
          "lastfm"
        )
        res.json(
          await this.providerService.getLastFMOverview(
            user.id,
            user.integrations[0].providerUsername,
            user.integrations[0].accessToken
          )
        )
      }
    )

    // MAL
    this.router.get(
      "/link/mal",
      auth("user.modify"),
      async (req: RequestAuth, res: Response) => {
        const existing = await Integration.findOne({
          where: {
            userId: req.user.id,
            type: "mal"
          }
        })
        if (existing) throw Errors.INTEGRATION_EXISTS
        await this.providerService.linkMAL(req.user.id, <string>req.query.token)
        res.sendStatus(204)
      }
    )

    this.router.get(
      "/userv3/mal/:username",
      auth("user.view"),
      async (req: RequestAuth, res: Response) => {
        const user = await this.providerService.verifyUser(
          req.params.username,
          "mal"
        )
        res.json(
          await this.providerService.getMALOverview(
            user.id,
            user.integrations[0].providerUsername,
            user.integrations[0].accessToken
          )
        )
      }
    )

    this.router.patch(
      "/userv3/mal/:username/anime",
      auth("user.modify"),
      async (req: RequestAuth, res: Response) => {
        const user = await this.providerService.verifyUser(
          req.params.username,
          "mal"
        )
        if (user.id !== req.user.id) throw Errors.NO_PERMISSION
        if (!req.body.id || typeof req.body.id !== "number")
          throw Errors.INVALID_ID
        await this.providerService.updateMALAnime(
          user.id,
          user.integrations[0].providerUsername,
          user.integrations[0].accessToken,
          req.body
        )
        res.sendStatus(204)
      }
    )
  }
}
