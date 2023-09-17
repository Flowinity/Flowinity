import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root } from "type-graphql"
import { Service } from "typedi"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import {
  partialUserBase,
  PartialUserBase
} from "@app/classes/graphql/user/partialUser"
import { ChatPermission } from "@app/models/chatPermission.model"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { AddRank } from "@app/classes/graphql/chat/ranks/addRank"
import { ChatService } from "@app/services/chat.service"
import { Context } from "@app/types/graphql/context"
import { GraphQLError } from "graphql/error"
import { ChatPermissions } from "@app/classes/graphql/chat/ranks/permissions"
import { ChatRankAssociation } from "@app/models/chatRankAssociation.model"
import { Namespace } from "socket.io"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import { ChatRank } from "@app/models/chatRank.model"
import { Success } from "@app/classes/graphql/generic/success"

@Resolver(ChatAssociation)
@Service()
export class ChatAssociationResolver {
  constructor(private chatService: ChatService) {}

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

  @FieldResolver(() => [ChatPermission])
  async ranks(@Root() chatAssociation: ChatAssociation) {
    return await chatAssociation.$get("ranks")
  }

  @FieldResolver(() => [String])
  async ranksMap(@Root() chatAssociation: ChatAssociation) {
    const ranks = await chatAssociation.$get("ranks", {
      order: [["index", "DESC"]]
    })
    return ranks.map((rank) => rank.id)
  }

  @FieldResolver(() => [String])
  async permissions(@Root() chatAssociation: ChatAssociation) {
    const ranks = await chatAssociation.$get("ranks", {
      order: [["index", "DESC"]],
      include: [
        {
          model: ChatPermission,
          as: "permissions"
        }
      ]
    })
    return [
      ...new Set(
        ranks.flatMap((rank) =>
          rank.permissions.map((permission) => permission.id)
        )
      )
    ]
  }

  @Authorization({
    scopes: ["chats.edit"]
  })
  @Mutation(() => Success)
  async toggleUserRank(@Ctx() ctx: Context, @Arg("input") input: AddRank) {
    const chat = this.chatService.getChatFromAssociation(
      input.chatAssociationId,
      ctx.user!!.id
    )
    if (!chat) throw new GraphQLError("Chat not found.")
    if (
      !(await this.chatService.checkPermission(
        ctx.user!!.id,
        input.chatAssociationId,
        ChatPermissions.MANAGE_RANKS
      ))
    )
      throw new GraphQLError(
        "You do not have the necessary permissions granted to do this."
      )

    const rank = await ChatRankAssociation.findOne({
      where: {
        chatAssociationId: input.updatingChatAssociationId,
        rankId: input.rankId
      }
    })

    if (rank) {
      await rank.destroy()
      this.chatService.emitForAll(
        input.chatAssociationId,
        ctx.user!!.id,
        "rankRemoved",
        input
      )
      return {
        success: true
      }
    } else {
      await ChatRankAssociation.create({
        chatAssociationId: input.updatingChatAssociationId,
        rankId: input.rankId
      })
      this.chatService.emitForAll(
        input.chatAssociationId,
        ctx.user!!.id,
        "rankAdded",
        input
      )
      return {
        success: true
      }
    }
  }
}
