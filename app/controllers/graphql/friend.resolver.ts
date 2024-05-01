import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql"
import { Service } from "typedi"
import { Context } from "@app/types/graphql/context"
import {
  partialUserFriend,
  PartialUserFriend
} from "@app/classes/graphql/user/partialUser"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { Friend } from "@app/models/friend.model"
import { FriendStatus } from "@app/classes/graphql/user/friends"
import { UserStatus } from "@app/classes/graphql/user/status"
import { FriendsInput } from "@app/classes/graphql/friends/getFriends"
import { AddFriendInput } from "@app/classes/graphql/friends/addFriend"
import { UserUtilsService } from "@app/services/userUtils.service"
import { GqlError } from "@app/lib/gqlErrors"
import { GraphQLError } from "graphql/error"

@Resolver(Friend)
@Service()
export class FriendResolver {
  constructor(private userUtilsService: UserUtilsService) {}

  @Authorization({
    scopes: "user.view",
    userOptional: true
  })
  @Query(() => [Friend])
  async friends(
    @Ctx() ctx: Context,
    @Arg("input", { nullable: true }) input?: FriendsInput
  ) {
    if (!ctx.user) return []
    const where = input?.status
      ? {
          userId: ctx.user!!.id,
          status: input.status.toLowerCase()
        }
      : { userId: ctx.user!!.id }

    return await Friend.findAll({ where })
  }

  @FieldResolver(() => PartialUserFriend)
  async user(@Root() friend: Friend) {
    // These are flipped around intentionally, as "user" makes more sense to be the friend.
    const fr = await friend.$get("otherUser", {
      attributes: partialUserFriend
    })
    if (friend.status !== FriendStatus.ACCEPTED && fr)
      fr.status = UserStatus.OFFLINE
    return fr
  }

  @FieldResolver(() => PartialUserFriend)
  async otherUser(@Root() friend: Friend) {
    return await friend.$get("user", {
      attributes: partialUserFriend
    })
  }

  @Authorization({
    scopes: "user.modify"
  })
  @Mutation(() => Boolean)
  async friend(@Ctx() ctx: Context, @Arg("input") input: AddFriendInput) {
    if (!input.username && !input.userId) {
      throw new GraphQLError("Please enter a username.")
    }
    return await this.userUtilsService.friend(
      ctx.user!!.id,
      input.username || input.userId,
      input.username ? "username" : "id",
      input.action,
      true
    )
  }
}
