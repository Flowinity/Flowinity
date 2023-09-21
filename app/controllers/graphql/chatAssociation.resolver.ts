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
import { Success } from "@app/classes/graphql/generic/success"
import { AddChatUser, ToggleUser } from "@app/classes/graphql/chat/addUser"
import { LeaveChatInput } from "@app/classes/graphql/chat/deleteChat"
import { GqlError } from "@app/lib/gqlErrors"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"

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
  async addChatUsers(@Ctx() ctx: Context, @Arg("input") input: AddChatUser) {
    await this.chatService.checkPermissions(
      ctx.user!!.id,
      input.chatAssociationId,
      ChatPermissions.ADD_USERS
    )

    if (input.action === ToggleUser.ADD) {
      await this.chatService.addUsersToChat(
        input.chatAssociationId,
        input.users,
        ctx.user!!.id
      )
      return { success: true }
    } else if (input.action === ToggleUser.REMOVE) {
      await this.chatService.removeUserFromChat(
        input.chatAssociationId,
        input.users,
        ctx.user!!.id
      )
      return { success: true }
    } else {
      return { success: false }
    }
  }

  @Authorization({
    scopes: ["chats.edit"]
  })
  @Mutation(() => Success)
  async toggleUserRank(@Ctx() ctx: Context, @Arg("input") input: AddRank) {
    const chat = await this.chatService.getChatFromAssociation(
      input.chatAssociationId,
      ctx.user!!.id
    )
    if (!chat) throw new GraphQLError("Chat not found.")
    await this.chatService.checkPermissions(
      ctx.user!!.id,
      input.chatAssociationId,
      ChatPermissions.MANAGE_RANKS
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
      const id = chat.users.find(
        (assoc) => assoc.id === input.updatingChatAssociationId
      )?.userId
      if (id) {
        this.chatService.syncPermissions(id, input.updatingChatAssociationId)
      }
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
      const id = chat.users.find(
        (assoc) => assoc.id === input.updatingChatAssociationId
      )?.userId
      if (id) {
        this.chatService.syncPermissions(id, input.updatingChatAssociationId)
      }
      return {
        success: true
      }
    }
  }

  @Authorization({
    scopes: ["chats.edit"]
  })
  @Mutation(() => Success)
  async leaveChat(
    @Ctx() ctx: Context,
    @Arg("input") input: LeaveChatInput
  ): Promise<Success> {
    const chat = await this.chatService.getChatFromAssociation(
      input.associationId,
      ctx.user!!.id
    )
    if (chat.userId === ctx.user!!.id && chat.type !== "direct") {
      throw new GqlError("GROUP_OWNER_CANNOT_LEAVE")
    }
    const association = await ChatAssociation.findOne({
      where: {
        id: input.associationId,
        userId: ctx.user!!.id
      }
    })
    if (!association) throw new GqlError("UNKNOWN")
    switch (chat.type) {
      case "group": {
        await this.chatService.removeUserFromChat(
          input.associationId,
          [ctx.user!!.id],
          ctx.user!!.id,
          true
        )
        return { success: true }
      }
      case "direct": {
        await association.update({
          hidden: true
        })
        socket.of(SocketNamespaces.CHAT).to(ctx.user!!.id).emit("removeChat", {
          id: chat.id
        })
        return { success: true }
      }
      default: {
        throw new GqlError("UNSUPPORTED_OPERATION")
      }
    }
  }
}
