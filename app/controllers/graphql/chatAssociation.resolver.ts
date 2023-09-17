import { FieldResolver, Resolver, Root } from "type-graphql"
import { Service } from "typedi"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import {
  partialUserBase,
  PartialUserBase
} from "@app/classes/graphql/user/partialUser"

@Resolver(ChatAssociation)
@Service()
export class ChatAssociationResolver {
  constructor() {}

  @FieldResolver(() => PartialUserBase, {
    nullable: true
  })
  async user(
    @Root() chatAssociation: ChatAssociation
  ): Promise<PartialUserBase | null> {
    if (!chatAssociation.userId)
      return await chatAssociation.$get("legacyUser", {
        attributes: partialUserBase
      })
    return (await chatAssociation.$get("tpuUser", {
      attributes: partialUserBase
    })) as PartialUserBase
  }

  @FieldResolver(() => PartialUserBase)
  async tpuUser(
    @Root() chatAssociation: ChatAssociation
  ): Promise<PartialUserBase> {
    return (await chatAssociation.$get("tpuUser", {
      attributes: partialUserBase
    })) as PartialUserBase
  }

  @FieldResolver(() => PartialUserBase)
  async legacyUser(
    @Root() chatAssociation: ChatAssociation
  ): Promise<PartialUserBase> {
    return (await chatAssociation.$get("legacyUser", {
      attributes: partialUserBase
    })) as PartialUserBase
  }
}
