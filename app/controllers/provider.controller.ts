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

    /**
     * @swagger
     * /api/v2/providers/tenor:
     *   get:
     *     summary: Retrieve Tenor data.
     *     description: Retrieves Tenor data based on the provided search query.
     *     tags:
     *       - ProvidersService
     *     security:
     *       - auth: [chats.view]
     *     parameters:
     *       - in: query
     *         name: search
     *         description: The search query to retrieve Tenor data.
     *         required: true
     *         schema:
     *           type: string
     *       - in: query
     *         name: next
     *         description: The token for paginating through Tenor results.
     *         required: false
     *         schema:
     *           type: string
     *     responses:
     *       '200':
     *         description: Successful response with Tenor data.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       '401':
     *         description: Unauthorized. User authentication required.
     *       '400':
     *         description: Invalid search query.
     */
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

    /**
     * @swagger
     * /api/v2/providers/linkable:
     *   get:
     *     summary: Retrieve linkable provider data.
     *     description: Retrieves a list of linkable providers with their details.
     *     tags:
     *       - ProvidersService
     *     security:
     *       - auth: [user.view]
     *     responses:
     *       '200':
     *         description: Successful response with linkable provider data.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   name:
     *                     type: string
     *                   id:
     *                     type: string
     *                   key:
     *                     type: string
     *                   url:
     *                     type: string
     *                     nullable: true
     *                   shortText:
     *                     type: string
     *                   color:
     *                     type: string
     *                   available:
     *                     type: boolean
     */
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
    /**
     * @swagger
     * /api/v2/providers/link/lastfm:
     *   get:
     *     summary: Link Last.fm integration.
     *     description: Links the Last.fm integration for the authenticated user.
     *     tags:
     *       - ProvidersService
     *     security:
     *       - auth: [user.modify]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         description: The authorization token for the user.
     *         required: true
     *         schema:
     *           type: string
     *           format: {token}
     *       - in: query
     *         name: token
     *         description: The token required for linking Last.fm integration.
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       '204':
     *         description: No content. Integration linked successfully.
     *       '401':
     *         description: Unauthorized. User authentication required.
     *       '409':
     *         description: Conflict. Integration already exists for the user.
     */
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

    /**
     * @swagger
     * /api/v2/providers/userv3/lastfm/{username}:
     *   get:
     *     summary: Retrieve Last.fm user information.
     *     description: Retrieves Last.fm user information for the specified username.
     *     tags:
     *       - ProvidersService
     *     security:
     *       - auth: ["user.view"]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         description: The authorization token for the user.
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       '200':
     *         description: Successful response with Last.fm user information.
     *       '401':
     *         description: Unauthorized. User authentication required.
     *       '400':
     *         description: See request body for more information.
     */
    this.router.get(
      "/userv3/lastfm/:username",
      auth("user.view"),
      async (req: RequestAuth, res: Response) => {
        const user = await this.providerService.verifyUser(
          req.params.username,
          "lastfm",
          req.user?.id
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
    /**
     * @swagger
     * /api/v2/providers/link/mal:
     *   get:
     *     summary: Link MAL integration.
     *     description: Links the Last.fm integration for the authenticated user.
     *     tags:
     *       - ProvidersService
     *     security:
     *       - auth: [user.modify]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         description: The authorization token for the user.
     *         required: true
     *         schema:
     *           type: string
     *           format: {token}
     *       - in: query
     *         name: token
     *         description: The token required for linking MAL integration.
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       '204':
     *         description: No content. Integration linked successfully.
     *       '401':
     *         description: Unauthorized. User authentication required.
     *       '409':
     *         description: Conflict. Integration already exists for the user.
     */
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

    /**
     * @swagger
     * /api/v2/providers/userv3/mal/{username}:
     *   get:
     *     summary: Retrieve MAL user information.
     *     description: Retrieves MAL user information for the specified username.
     *     tags:
     *       - ProvidersService
     *     security:
     *       - auth: ["user.view"]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         description: The authorization token for the user.
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       '200':
     *         description: Successful response with Last.fm user information.
     *       '401':
     *         description: Unauthorized. User authentication required.
     *       '400':
     *         description: See request body for more information.
     */
    this.router.get(
      "/userv3/mal/:username",
      auth("user.view"),
      async (req: RequestAuth, res: Response) => {
        const user = await this.providerService.verifyUser(
          req.params.username,
          "mal",
          req.user?.id
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

    /**
     * @swagger
     * /api/v2/providers/userv3/mal/{username}/anime:
     *   patch:
     *     summary: Update MAL anime information for a user.
     *     description: Updates MyAnimeList (MAL) anime information for the specified user.
     *     tags:
     *       - ProvidersService
     *     security:
     *       - auth: [user.modify]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         description: The authorization token for the user.
     *         required: true
     *         schema:
     *           type: string
     *       - in: path
     *         name: username
     *         description: The username of the MAL user.
     *         required: true
     *         schema:
     *           type: string
     *       - in: body
     *         name: animeData
     *         description: The updated anime information for MAL.
     *         required: true
     *         schema:
     *           type: object
     *           properties:
     *            id:
     *              type: number
     *              description: The ID of the anime.
     *              required: true
     *              example: 1
     *           num_episodes_watched:
     *              type: number
     *              description: The number of episodes watched.
     *              example: 1
     *           score:
     *              type: number
     *              description: The score given to the anime.
     *              example: 10
     *              minimum: 0
     *              maximum: 10
     *           status:
     *              type: string
     *              description: The status of the anime.
     *              example: "completed"
     *              enum:
     *                - "watching"
     *                - "completed"
     *                - "on_hold"
     *                - "dropped"
     *                - "plan_to_watch"
     *     responses:
     *       '204':
     *         description: No content. MAL anime information updated successfully.
     *       '401':
     *         description: Unauthorized. User authentication required.
     *       '403':
     *         description: Forbidden. No permission to update anime information for the user.
     *       '400':
     *         description: Bad Request. Invalid anime ID provided.
     *       '404':
     *         description: Not Found. MAL user not found.
     */

    this.router.patch(
      "/userv3/mal/:username/anime",
      auth("user.modify"),
      async (req: RequestAuth, res: Response) => {
        const user = await this.providerService.verifyUser(
          req.params.username,
          "mal",
          req.user?.id
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

    this.router.delete(
      "/:id",
      auth("user.modify"),
      async (req: RequestAuth, res: Response) => {
        const integration = await Integration.findOne({
          where: {
            id: req.params.id,
            userId: req.user.id
          }
        })
        if (!integration) throw Errors.INTEGRATION_NOT_FOUND
        await integration.destroy()
        res.sendStatus(204)
      }
    )
  }
}
