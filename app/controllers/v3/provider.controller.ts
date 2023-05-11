import {
  Get,
  JsonController,
  Param,
  QueryParam,
  Patch,
  Body,
  BodyParam,
  Delete
} from "routing-controllers"
import { Service } from "typedi"
import { ProviderService } from "@app/services/provider.service"
import { Auth } from "@app/lib/auth"
import { User } from "@app/models/user.model"
import cryptoRandomString from "crypto-random-string"
import { Integration } from "@app/models/integration.model"
import Errors from "@app/lib/errors"
import { LastfmService } from "@app/services/providers/lastfm.service"
import { MyAnimeListService } from "@app/services/providers/mal.service"
import { MalBody } from "@app/interfaces/mal"

@Service()
@JsonController("/providers")
export class ProviderControllerV3 {
  constructor(
    private readonly providerService: ProviderService,
    private readonly lfmService: LastfmService,
    private readonly malService: MyAnimeListService
  ) {}
  @Get("/tenor")
  async searchTenor(
    @Auth("user.view") user: User,
    @QueryParam("search") search: string,
    @QueryParam("next") limit: string
  ) {
    return await this.providerService.tenor(search, limit)
  }

  @Get("/linkable")
  async getLinkableProviders(@Auth("user.view", false) user: User) {
    const malCodeChallenge = cryptoRandomString({ length: 128 })
    if (user) {
      await redis.set(
        `providers:mal:${user.id}:code_challenge`,
        malCodeChallenge,
        { EX: 3600 }
      )
    }
    return [
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
    ]
  }

  @Get("/link/lastfm")
  @Get("/link/last-fm")
  async linkLastfm(
    @Auth("user.view") user: User,
    @QueryParam("token") token: string
  ) {
    const existing = await Integration.findOne({
      where: {
        userId: user.id,
        type: "lastfm"
      }
    })
    if (existing) throw Errors.INTEGRATION_EXISTS
    await this.lfmService.linkLastFM(user.id, token)
  }

  @Get("/userv3/lastfm/:username")
  async getUserV3LastfmWidget(
    @Auth("user.view") authUser: User,
    @Param("username") username: string
  ) {
    const user = await this.providerService.verifyUser(
      username,
      "lastfm",
      authUser.id
    )
    return await this.lfmService.getLastFMOverview(
      user.id,
      user.integrations[0]?.providerUsername,
      user.integrations[0]?.accessToken
    )
  }

  // MyAnimeList
  @Get("/link/mal")
  async linkMal(
    @Auth("user.view") user: User,
    @QueryParam("token") token: string
  ) {
    const existing = await Integration.findOne({
      where: {
        userId: user.id,
        type: "mal"
      }
    })
    if (existing) throw Errors.INTEGRATION_EXISTS
    await this.malService.linkMAL(user.id, token)
  }

  @Get("/userv3/mal/:username")
  async getUserV3MalWidget(
    @Auth("user.view") authUser: User,
    @Param("username") username: string
  ) {
    const user = await this.providerService.verifyUser(
      username,
      "mal",
      authUser.id
    )
    return await this.malService.getMALOverview(
      user.id,
      user.integrations[0]?.providerUsername,
      user.integrations[0]?.accessToken
    )
  }

  @Patch("/userv3/mal/:username/anime")
  async updateUserV3MalAnime(
    @Auth("user.view") authUser: User,
    @Param("username") username: string,
    @BodyParam("id") id: number,
    @Body() body: MalBody
  ) {
    const user = await this.providerService.verifyUser(
      username,
      "mal",
      authUser.id
    )
    if (user.id !== user.id) throw Errors.NO_PERMISSION
    await this.malService.updateMALAnime(
      user.id,
      user.integrations[0]?.providerUsername,
      user.integrations[0]?.accessToken,
      body
    )
  }

  @Delete("/:integrationId")
  async deleteProvider(
    @Auth("user.view") user: User,
    @Param("integrationId") id: number
  ) {
    const provider = await Integration.findOne({
      where: {
        userId: user.id,
        id
      }
    })
    if (!provider) throw Errors.NOT_FOUND
    await provider.destroy()
  }
}
