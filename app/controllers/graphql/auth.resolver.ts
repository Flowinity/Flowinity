import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql"
import { User } from "@app/models/user.model"
import { Service } from "typedi"
import { Context } from "@app/types/graphql/context"
import {
  LoginInput,
  LoginResponse,
  RegisterInput
} from "@app/classes/graphql/auth/login"
import { AuthService } from "@app/services/auth.service"
import Errors from "@app/lib/errors"
import blacklist from "@app/lib/word-blacklist.json"
import { InviteService } from "@app/services/invite.service"

@Resolver(User)
@Service()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private inviteService: InviteService
  ) {}

  @Mutation(() => LoginResponse)
  async login(@Arg("input") input: LoginInput, @Ctx() ctx: Context) {
    return await this.authService.login(
      input.username,
      input.password,
      input.totp,
      true
    )
  }

  @Authorized()
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: Context) {
    return await this.authService.logout(ctx.token)
  }

  @Mutation(() => LoginResponse)
  async register(@Arg("input") input: RegisterInput) {
    const invite = input.inviteKey
      ? await this.inviteService.getInviteCache(input.inviteKey)
      : null
    if (!config.registrations) {
      if (!invite) throw Errors.INVITE_NOT_FOUND

      if (invite.registerUserId) throw Errors.INVITE_ALREADY_USED
    }
    // check the username to the blacklist
    if (blacklist.includes(input.username)) {
      throw Errors.INVALID_USERNAME
    }
    return await this.authService.register(
      input.username,
      input.password,
      input.email,
      invite?.id
    )
  }
}
