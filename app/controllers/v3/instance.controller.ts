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
import rateLimits from "@app/lib/rateLimits"
import Errors from "@app/lib/errors"
import { UserUtilsService } from "@app/services/userUtils.service"

@Service()
@JsonController("/instances")
export class InstanceControllerV3 {
  constructor(private readonly userService: UserUtilsService) {}

  @Post("/feedback")
  @UseBefore(rateLimits.standardLimiter)
  async ingestInstanceFeedback(
    @Body()
    body: {
      text: string
      starRating: number
      route: string
      userId: number
      hostname: string
    }
  ) {
    return await this.userService.sendFeedback(
      undefined,
      body.text,
      body.starRating,
      body.route,
      JSON.stringify({
        hostname: body.hostname,
        userId: body.userId,
        thirdParty: true
      })
    )
  }
}
