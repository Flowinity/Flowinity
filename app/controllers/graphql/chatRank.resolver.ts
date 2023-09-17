import { Field, FieldResolver, Resolver, Root } from "type-graphql"
import { Service } from "typedi"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import {
  partialUserBase,
  PartialUserBase
} from "@app/classes/graphql/user/partialUser"
import { ChatPermission } from "@app/models/chatPermission.model"
import { ChatRank } from "@app/models/chatRank.model"

@Resolver(ChatRank)
@Service()
export class ChatRankResolver {
  constructor() {}

  @FieldResolver(() => [ChatPermission])
  async permissions(@Root() chatRank: ChatRank) {
    return await chatRank.$get("permissions")
  }

  @FieldResolver(() => [String])
  async permissionsMap(@Root() chatRank: ChatRank) {
    const permissions = await chatRank.$get("permissions")
    return permissions.map((permission) => permission.id)
  }
}
