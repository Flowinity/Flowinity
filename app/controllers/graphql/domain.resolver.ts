import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql"
import { User } from "@app/models/user.model"
import { Service } from "typedi"
import { Domain } from "@app/models/domain.model"
import { partialUserBase } from "@app/classes/graphql/user/partialUser"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { Context } from "@app/types/graphql/context"
import { GraphQLError } from "graphql/error"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"

@Resolver(Domain)
@Service()
export class DomainResolver {
  @Authorization({
    scopes: "user.view"
  })
  @Query(() => [Domain])
  async domains() {
    return await Domain.findAll()
  }

  @FieldResolver(() => [User])
  async user(@Root() domain: Domain) {
    return domain.$get("user", {
      attributes: partialUserBase
    })
  }

  @Authorization({
    scopes: "user.modify"
  })
  @Mutation(() => Domain)
  async applyDomain(
    @Ctx() ctx: Context,
    @Arg("domainId", () => Int) domainId: number
  ) {
    const domain = await Domain.findOne({
      where: {
        id: domainId
      }
    })
    if (!domain) throw new GraphQLError("Domain not found.")
    await User.update(
      {
        domainId: domain.id
      },
      {
        where: { id: ctx.user?.id }
      }
    )
    socket
      .of(SocketNamespaces.USER)
      .to(ctx.user?.id)
      .emit("userSettingsUpdate", {
        domainId: domain.id
      })
    return domain
  }
}
