import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql"
import { OauthApp } from "@app/models/oauthApp.model"
import { Service } from "typedi"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { Context } from "@app/types/graphql/context"
import { OauthUser } from "@app/models/oauthUser.model"
import {
  partialUserBase,
  PartialUserBase
} from "@app/classes/graphql/user/partialUser"
import { MyAppInput } from "@app/classes/graphql/developers/app"

@Resolver(OauthApp)
@Service()
export class OAuthAppResolver {
  @Authorization({
    scopes: ["dev.view"]
  })
  @Query(() => [OauthApp])
  async devApps(@Ctx() ctx: Context) {
    return await OauthApp.findAll({
      where: {
        userId: ctx.user!!.id
      }
    })
  }

  @Authorization({
    scopes: ["dev.view"]
  })
  @Query(() => [OauthApp])
  async devApp(@Ctx() ctx: Context, @Arg("input") input: MyAppInput) {
    return await OauthApp.findAll({
      where: {
        userId: ctx.user!!.id,
        id: input.id
      }
    })
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
}

@Resolver(OauthUser)
@Service()
export class OAuthUserResolver {
  @FieldResolver(() => PartialUserBase)
  async user(@Root() root: OauthUser) {
    return await root.$get("user", {
      attributes: partialUserBase
    })
  }
}
