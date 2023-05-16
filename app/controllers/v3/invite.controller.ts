import {Body, Get, JsonController, Param, Post} from "routing-controllers"
import {Service} from "typedi"
import {Auth} from "@app/lib/auth"
import {User} from "@app/models/user.model"
import {InviteService} from "@app/services/invite.service"

@Service()
@JsonController("/invites")
export class InviteControllerV3 {
  constructor(private readonly inviteService: InviteService) {
  }

  @Get("/:inviteKey")
  async getInvite(@Param("inviteKey") inviteKey: string) {
    return await this.inviteService.getInvite(inviteKey)
  }

  @Post("")
  async createInvite(
    @Auth("user.view") user: User,
    @Body()
      body: {
      email: string
    }
  ) {
    await this.inviteService.createInvite(user.id, body.email)
  }
}
