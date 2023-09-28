import { FieldResolver, Query, Resolver, Root } from "type-graphql"
import { User } from "@app/models/user.model"
import { Service } from "typedi"
import { Domain } from "@app/models/domain.model"
import { partialUserBase } from "@app/classes/graphql/user/partialUser"
import { Authorization } from "@app/lib/graphql/AuthChecker"

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
}
