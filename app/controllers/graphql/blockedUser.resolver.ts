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
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { AccessLevel } from "@app/enums/admin/AccessLevel"
import { Success } from "@app/classes/graphql/generic/success"
import { Context } from "@app/types/graphql/context"
import { Chat } from "@app/models/chat.model"
import { BlockedUser } from "@app/models/blockedUser.model"
import { BlockUserInput } from "@app/classes/graphql/blockedUsers/blockUser"
import { User } from "@app/models/user.model"
import { GqlError } from "@app/lib/gqlErrors"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import {
  partialUserBase,
  PartialUserBase
} from "@app/classes/graphql/user/partialUser"

@Resolver(BlockedUser)
@Service()
export class BlockedUserResolver {
  @Authorization({
    scopes: ["user.view"],
    userOptional: true
  })
  @Query(() => [BlockedUser])
  async blockedUsers(@Ctx() ctx: Context) {
    if (!ctx.user) return []
    return await BlockedUser.findAll({
      where: {
        userId: ctx.user.id
      }
    })
  }

  @Authorization({
    scopes: ["user.modify"]
  })
  @Mutation(() => Success)
  async blockUser(
    @Ctx() ctx: Context,
    @Arg("input") input: BlockUserInput
  ): Promise<Success> {
    const user = await User.findOne({
      where: {
        id: input.userId
      }
    })
    if (!user) throw new GqlError("USER_NOT_FOUND")
    const exists = await BlockedUser.findOne({
      where: {
        userId: ctx.user!!.id,
        blockedUserId: input.userId
      }
    })
    if (exists) {
      await exists.destroy()
      socket.of(SocketNamespaces.USER).to(ctx.user!!.id).emit("userBlocked", {
        blockedUserId: input.userId,
        blocked: false
      })
      if (!exists.silent) {
        socket
          .of(SocketNamespaces.TRACKED_USERS)
          .to(input.userId)
          .emit("userBlocked", {
            userId: ctx.user!!.id,
            blocked: false
          })
      }
      return { success: true }
    } else {
      const block = await BlockedUser.create({
        userId: ctx.user!!.id,
        blockedUserId: input.userId,
        silent: input.silent
      })
      if (!input.silent) {
        socket
          .of(SocketNamespaces.TRACKED_USERS)
          .to(input.userId)
          .emit("userBlocked", {
            userId: ctx.user!!.id,
            blocked: true
          })
      }
      socket
        .of(SocketNamespaces.USER)
        .to(ctx.user!!.id)
        .emit("userBlocked", {
          ...block.toJSON(),
          blocked: true
        })
      return { success: true }
    }
  }

  @FieldResolver(() => PartialUserBase)
  async user(@Root() blockedUser: BlockedUser) {
    return await blockedUser.$get("user", {
      attributes: partialUserBase
    })
  }

  @FieldResolver(() => PartialUserBase)
  async blockedUser(@Root() blockedUser: BlockedUser) {
    return await blockedUser.$get("blockedUser", {
      attributes: partialUserBase
    })
  }
}
