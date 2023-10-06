import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql"
import { OauthApp } from "@app/models/oauthApp.model"
import { Service } from "typedi"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { Context } from "@app/types/graphql/context"
import { OauthUser } from "@app/models/oauthUser.model"
import {
  partialUserBase,
  PartialUserBase
} from "@app/classes/graphql/user/partialUser"
import {
  AuthorizeAppInput,
  AuthorizeAppResponse,
  CreateAppInput,
  CreateBotInput,
  MyAppInput,
  OauthAppSecret,
  UpdateAppInput
} from "@app/classes/graphql/developers/app"
import RateLimit from "@app/lib/graphql/RateLimit"
import { GqlError } from "@app/lib/gqlErrors"
import { AdminService } from "@app/services/admin.service"
import {
  AddAppUserInput,
  UpdateAppUserInput
} from "@app/classes/graphql/developers/updateUser"
import { Success } from "@app/classes/graphql/generic/success"
import { User } from "@app/models/user.model"
import { GraphQLError } from "graphql/error"
import argon2 from "argon2"
import utils from "@app/lib/utils"
import { OauthService } from "@app/services/oauth.service"
import Errors from "@app/lib/errors"
import { OauthConsentApp } from "@app/classes/graphql/developers/oauthConsentApp"
import {
  DeregisterCommand,
  RegisterCommand,
  RegisterCommands,
  RegisterPrefix
} from "@app/classes/graphql/developers/prefix/register"
import {
  Command,
  LookupPrefix
} from "@app/classes/graphql/developers/prefix/prefix"

@Resolver(OauthApp)
@Service()
export class OAuthAppResolver {
  constructor(
    public adminService: AdminService,
    public oauthService: OauthService
  ) {}

  @Authorization({
    scopes: ["dev.view"]
  })
  @Query(() => [OauthApp])
  async oauthApps(@Ctx() ctx: Context) {
    const owned = await OauthApp.findAll({
      where: {
        userId: ctx.user!!.id
      }
    })
    const shared = await OauthApp.findAll({
      include: [
        {
          model: OauthUser,
          as: "oauthUser",
          required: true,
          where: {
            userId: ctx.user!!.id,
            manage: true
          }
        }
      ]
    })
    return [...owned, ...shared]
  }

  @Authorization({
    scopes: ["dev.view"]
  })
  @Query(() => OauthApp)
  async oauthApp(@Ctx() ctx: Context, @Arg("input") input: MyAppInput) {
    const app = await this.adminService.getOauthById(
      input.id,
      ctx.user!!.id,
      true
    )
    if (!app) throw new GqlError("APP_NOT_FOUND")
    return app
  }

  @Authorization({
    scopes: ["oauth.authorize"]
  })
  @Query(() => OauthConsentApp)
  async oauthAppConsent(@Ctx() ctx: Context, @Arg("input") input: MyAppInput) {
    const app = await this.oauthService.getApp(input.id, ctx.user!!.id)
    if (!app) throw new GqlError("APP_NOT_FOUND")
    return {
      ...app.toJSON(),
      secret: undefined
    }
  }

  @Authorization({
    scopes: ["oauth.authorize"]
  })
  @Mutation(() => AuthorizeAppResponse)
  async oauthAppAuthorize(
    @Ctx() ctx: Context,
    @Arg("input") input: AuthorizeAppInput
  ): Promise<AuthorizeAppResponse> {
    const app = await this.oauthService.getApp(input.id, ctx.user!!.id)
    if (!app) throw Errors.NOT_FOUND

    if (input.scopes !== app.scopes)
      throw new GraphQLError("Scopes do not match.")

    if (app.private && app.userId !== ctx.user!!.id) {
      const access = await OauthUser.findOne({
        where: {
          id: input.id,
          userId: ctx.user!!.id,
          active: true
        }
      })
      if (!access) throw Errors.PRIVATE_APP
    }

    return {
      token: await this.oauthService.getOrCreateOauthToken(
        app.id,
        ctx.user!!.id,
        true,
        input.scopes
      )
    }
  }

  @Authorization({
    scopes: ["oauth.authorize"]
  })
  @Mutation(() => Success)
  async oauthAppDeauthorize(
    @Ctx() ctx: Context,
    @Arg("input") input: MyAppInput
  ): Promise<Success> {
    const app = await this.oauthService.getApp(input.id, ctx.user!!.id)
    if (!app) throw Errors.NOT_FOUND

    await this.oauthService.deauthorize(app.id, ctx.user!!.id)
    return { success: true }
  }

  @Authorization({
    scopes: ["*"]
  })
  @Query(() => [OauthApp])
  async getAuthorizedApps(@Ctx() ctx: Context) {
    return await this.oauthService.getApps(ctx.user!!.id)
  }

  @FieldResolver(() => [OauthUser])
  async oauthUsers(@Root() root: OauthApp) {
    return await root.$get("oauthUsers")
  }

  @FieldResolver(() => PartialUserBase)
  async user(@Root() root: OauthUser) {
    return await root.$get("user", {
      attributes: partialUserBase
    })
  }

  @RateLimit({
    window: 8,
    max: 1
  })
  @Authorization({
    scopes: ["dev.modify"]
  })
  @Mutation(() => OauthApp)
  async createOauthApp(
    @Ctx() ctx: Context,
    @Arg("input") input: CreateAppInput
  ) {
    if (!ctx.user?.administrator && input.verified)
      throw new GqlError("NOT_ADMIN")
    return await this.adminService.createOauth(input, ctx.user!!.id)
  }

  @Authorization({
    scopes: ["dev.modify"]
  })
  @Mutation(() => Success)
  async deleteOauthApp(
    @Ctx() ctx: Context,
    @Arg("input") input: MyAppInput
  ): Promise<Success> {
    await this.adminService.deleteOauth(input.id, ctx.user!!.id)
    return { success: true }
  }

  @Authorization({
    scopes: ["dev.modify"]
  })
  @Mutation(() => Success)
  async resetOauthSecret(
    @Ctx() ctx: Context,
    @Arg("input") input: MyAppInput
  ): Promise<Success> {
    await this.adminService.resetOauthSecret(input.id, ctx.user!!.id)
    return { success: true }
  }

  @Authorization({
    scopes: ["dev.modify"]
  })
  @Mutation(() => Success)
  async updateOauthApp(
    @Ctx() ctx: Context,
    @Arg("input") input: UpdateAppInput
  ): Promise<OauthApp> {
    const app = await this.adminService.getOauthById(input.id, ctx.user!!.id)
    if (!app) throw new GqlError("APP_NOT_FOUND")
    if (app.verified !== input.verified && !ctx.user!!.administrator)
      throw new GqlError("NOT_ADMIN")
    await this.adminService.updateOauth(input, ctx.user!!.id)
    return app
  }

  @Authorization({
    scopes: ["dev.modify"]
  })
  @Mutation(() => PartialUserBase)
  async createBotOauthApp(
    @Ctx() ctx: Context,
    @Arg("input") input: CreateBotInput
  ): Promise<PartialUserBase> {
    const app = await this.oauthApp(ctx, input)
    if (app.botId)
      throw new GraphQLError("This app already has a linked bot account.")
    try {
      const user = await User.create({
        username: input.username,
        password: "sso-enforced",
        email: (await utils.generateAPIKey("bot-email")) + "@troplo.com",
        emailVerified: true,
        planId: 1,
        bot: true
      })
      await app.update({
        botId: user.id
      })
      return user
    } catch {
      throw new GqlError("USERNAME_TAKEN")
    }
  }

  @FieldResolver(() => PartialUserBase)
  async bot(@Root() root: OauthApp) {
    return await root.$get("bot", {
      attributes: partialUserBase
    })
  }
}

@Resolver(OauthUser)
@Service()
export class OAuthUserResolver {
  constructor(private oauthAppResolver: OAuthAppResolver) {}
  @FieldResolver(() => PartialUserBase)
  async user(@Root() root: OauthUser) {
    return await root.$get("user", {
      attributes: partialUserBase
    })
  }

  @Authorization({
    scopes: ["dev.modify"]
  })
  @Mutation(() => OauthUser)
  async updateOauthUser(
    @Ctx() ctx: Context,
    @Arg("input") input: UpdateAppUserInput
  ) {
    const app = await this.oauthAppResolver.oauthApp(ctx, {
      id: input.oauthAppId
    })
    const user = await OauthUser.findOne({
      where: {
        oauthAppId: app.id,
        id: input.id
      }
    })
    if (!user) throw new GqlError("APP_USER_NOT_FOUND")
    await user.update({
      manage: input.manage
    })
    return {
      ...user.toJSON(),
      manage: input.manage
    }
  }

  @Authorization({
    scopes: ["dev.modify"]
  })
  @Mutation(() => OauthUser)
  async addOauthUser(
    @Ctx() ctx: Context,
    @Arg("input") input: AddAppUserInput
  ) {
    return await this.oauthAppResolver.adminService.createOauthUser(
      input.oauthAppId,
      input.username,
      ctx.user!!.id,
      input.manage
    )
  }

  // Bot "Slash Commands" but done properly
  @Authorization({
    scopes: ["user.view"]
  })
  @Mutation(() => Success)
  async registerBotPrefix(
    @Ctx() ctx: Context,
    @Arg("input") input: RegisterPrefix
  ) {
    if (input.prefix.includes("!"))
      throw new GraphQLError("Do not include ! in prefix")
    if (!ctx.user?.bot) throw new GqlError("NOT_BOT")
    await redis.json.set(`prefix:${ctx.user.id}`, "$", input.prefix + "!")
    return { success: true }
  }

  @Authorization({
    scopes: ["user.view"]
  })
  @Mutation(() => Success)
  async registerBotCommands(
    @Ctx() ctx: Context,
    @Arg("input") input: RegisterCommands
  ) {
    if (!ctx.user?.bot) throw new GqlError("NOT_BOT")
    await redis.json.set(`commands:${ctx.user.id}`, "$", input.commands)
    return { success: true }
  }
}

@Resolver(OauthConsentApp)
@Service()
export class OauthConsentAppResolver {
  @FieldResolver(() => [PartialUserBase])
  async bot(@Root() root: OauthApp) {
    return await root.$get("bot")
  }
}
