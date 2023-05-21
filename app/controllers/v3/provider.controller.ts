import {
  Body,
  BodyParam,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParam
} from "routing-controllers"
import { Service } from "typedi"

// Import Libs
import { Auth } from "@app/lib/auth"
import Errors from "@app/lib/errors"

// Import Services
import { ProviderService } from "@app/services/provider.service"
import { DiscordService } from "@app/services/providers/discord.service"
import { LastfmService } from "@app/services/providers/lastfm.service"
import { MyAnimeListService } from "@app/services/providers/mal.service"

// Import Models
import { User } from "@app/models/user.model"

// Import Interfaces
import { MalBody } from "@app/interfaces/mal"

@Service()
@JsonController("/providers")
export class ProviderControllerV3 {
  constructor(
    private readonly providerService: ProviderService,
    private readonly discordService: DiscordService,
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
    return await this.providerService.getLinkableProviders(user)
  }

  @Post("/link/lastfm")
  @Post("/link/last-fm")
  async linkLastfm(
    @Auth("user.view") user: User,
    @Body() body: { token: string }
  ) {
    return await this.lfmService.link(user.id, body.token)
  }

  @Delete("/unlink/lastfm")
  @Delete("/unlink/last-fm")
  async unlinkLastfm(@Auth("user.view") user: User) {
    return await this.lfmService.unlink(user.id)
  }

  @Get("/userv3/lastfm/:username")
  async getUserV3LastfmWidget(
    @Auth("user.view", false) authUser: User,
    @Param("username") username: string
  ) {
    const user: User = await this.providerService.verifyUser(
      username,
      "lastfm",
      authUser?.id
    )

    return await this.lfmService.getOverview(
      user.id,
      user.integrations[0]?.providerUsername,
      user.integrations[0]?.accessToken
    )
  }

  // Discord
  @Post("/link/discord")
  async linkDiscord(
    @Auth("user.view") user: User,
    @Body() body: { token: string }
  ) {
    return await this.discordService.link(user.id, body.token)
  }

  @Delete("/unlink/discord")
  async unlinkDiscord(@Auth("user.view") user: User) {
    return await this.discordService.unlink(user.id)
  }

  // MyAnimeList
  @Post("/link/mal")
  async linkMal(
    @Auth("user.view") user: User,
    @Body() body: { token: string }
  ) {
    return await this.malService.link(user.id, body.token)
  }

  @Delete("/unlink/mal")
  async unlinkMal(@Auth("user.view") user: User) {
    return await this.malService.unlink(user.id)
  }

  @Get("/userv3/mal/:username")
  async getUserV3MalWidget(
    @Auth("user.view", false) authUser: User,
    @Param("username") username: string
  ) {
    const user: User = await this.providerService.verifyUser(
      username,
      "mal",
      authUser?.id
    )

    return await this.malService.getOverview(
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
    const user: User = await this.providerService.verifyUser(
      username,
      "mal",
      authUser.id
    )

    if (user.id !== user.id) throw Errors.NO_PERMISSION

    return await this.malService.updateAnime(
      user.id,
      user.integrations[0]?.providerUsername,
      user.integrations[0]?.accessToken,
      body
    )
  }
}
