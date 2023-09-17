import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Info,
  Int,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql"
import { UserUtilsService } from "@app/services/userUtils.service"
import { User } from "@app/models/user.model"
import { Service } from "typedi"
import { Session } from "@app/models/session.model"
import { Op } from "sequelize"
import { Experiment } from "@app/models/experiment.model"
import { Subscription } from "@app/models/subscription.model"
import { Domain } from "@app/models/domain.model"
import { Plan } from "@app/models/plan.model"
import { Theme } from "@app/models/theme.model"
import { Integration } from "@app/models/integration.model"
import { Badge } from "@app/models/badge.model"
import { Includeable } from "sequelize"
import { Context } from "@app/types/graphql/context"
import { GraphQLResolveInfo } from "graphql/type"
import { Notification } from "@app/models/notification.model"
import {
  PartialUserBase,
  partialUserBase,
  partialUserFriend,
  PartialUserFriend
} from "@app/classes/graphql/user/partialUser"
import { EXPECTED_OPTIONS_KEY, createContext } from "dataloader-sequelize"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { Friend } from "@app/models/friend.model"
import { FriendStatus } from "@app/classes/graphql/user/friends"
import { UserStatus } from "@app/classes/graphql/user/status"
import { FriendsInput } from "@app/classes/graphql/friends/getFriends"

@Resolver(Friend)
@Service()
export class FriendResolver {
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
    return await Friend.findAll({
      where: {
        userId: ctx.user!!.id,
        status: input?.status ? input.status.toLowerCase() : "accepted"
      }
    })
  }

  @FieldResolver(() => PartialUserFriend)
  async user(@Root() friend: Friend) {
    // These are flipped around intentionally, as "user" makes more sense to be the friend.
    const fr = await friend.$get("otherUser", {
      attributes: partialUserFriend
    })
    if (friend.status !== FriendStatus.ACCEPTED && fr)
      fr.status = UserStatus.UNKNOWN
    return fr
  }

  @FieldResolver(() => PartialUserFriend)
  async otherUser(@Root() friend: Friend) {
    return await friend.$get("user", {
      attributes: partialUserFriend
    })
  }
}
