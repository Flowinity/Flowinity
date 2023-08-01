import {
  Body,
  JsonController,
  OnUndefined,
  Patch,
  Post,
  UseBefore
} from "routing-controllers"
import { Service } from "typedi"
import Errors from "@app/lib/errors"
import rateLimits from "@app/lib/rateLimits"
import { AuthService } from "@app/services/auth.service"
import { InviteService } from "@app/services/invite.service"
import { AdminService } from "@app/services/admin.service"
import blacklist from "@app/lib/word-blacklist.json"

@Service()
@JsonController("/auth")
export class AuthControllerV3 {
  constructor(
    private readonly authService: AuthService,
    private readonly inviteService: InviteService,
    private readonly adminService: AdminService
  ) {}

  @Post("/login")
  @UseBefore(rateLimits.loginLimiter)
  async login(
    @Body() body: { email: string; password: string; code?: string }
  ) {
    if (!body.email || !body.password) throw Errors.INVALID_CREDENTIALS
    return await this.authService.login(body.email, body.password, body.code)
  }

  @Post("/register")
  @UseBefore(rateLimits.registerLimiter)
  async register(
    @Body()
    body: {
      email: string
      username: string
      password: string
      inviteKey?: string
    }
  ) {
    const invite = body.inviteKey
      ? await this.inviteService.getInviteCache(body.inviteKey)
      : null
    if (!config.registrations) {
      if (!invite) throw Errors.INVITE_NOT_FOUND

      if (invite.registerUserId) throw Errors.INVITE_ALREADY_USED
    }
    // check the username to the blacklist
    if (blacklist.includes(body.username)) {
      throw Errors.INVALID_USERNAME
    }
    return await this.authService.register(
      body.username,
      body.password,
      body.email,
      invite?.id
    )
  }

  @OnUndefined(204)
  @Post("/recover")
  @UseBefore(rateLimits.mailLimiter)
  async recover(@Body() body: { email: string }) {
    const recovery = await this.authService.passwordReset(body.email)
    this.adminService.sendEmail(
      {
        body: {
          intro: `Account recovery`,
          title: `Hello ${recovery.username}.`,
          action: [
            {
              instructions: `You requested a password reset for your TPU account. Please use the button below to recover your account.`,
              button: {
                color: "#0190ea", // Optional action button color
                text: "Recover account",
                link:
                  config.hostnameWithProtocol +
                  "/passwordReset/" +
                  recovery.code
              }
            }
          ]
        }
      },
      body.email,
      "TPU account password reset"
    )
    return
  }

  @OnUndefined(204)
  @Patch("/recover")
  @UseBefore(rateLimits.mailLimiter)
  async recoverPassword(@Body() body: { code: string; password: string }) {
    return await this.authService.passwordResetConfirm(body.code, body.password)
  }
}
