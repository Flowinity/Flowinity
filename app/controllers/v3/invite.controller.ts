import {
  Body,
  Get,
  JsonController,
  Param,
  Post,
  UseBefore
} from "routing-controllers"
import { Service } from "typedi"
import { Auth } from "@app/lib/auth"
import { User } from "@app/models/user.model"
import { InviteService } from "@app/services/invite.service"
import rateLimits, { inviteAFriendLimiter } from "@app/lib/rateLimits"
import Errors from "@app/lib/errors"

@Service()
@JsonController("/invites")
export class InviteControllerV3 {
  constructor(private readonly inviteService: InviteService) {}

  @Get("/:inviteKey")
  async getInvite(@Param("inviteKey") inviteKey: string) {
    const invite = await this.inviteService.getInvite(inviteKey)
    if (!invite) throw Errors.INVITE_NOT_FOUND
    return invite
  }

  @Post("")
  @UseBefore(rateLimits.inviteAFriendLimiter)
  async createInvite(
    @Auth("user.view") user: User,
    @Body()
    body: {
      email: string
    }
  ) {
    if (!config.inviteAFriend && !user.administrator && !user.moderator)
      throw Errors.INVITE_A_FRIEND_DISABLED
    await this.inviteService.createInvite(user.id, body.email)
  }
}
