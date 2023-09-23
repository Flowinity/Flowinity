import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root } from "type-graphql"
import { Container, Service } from "typedi"
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
import { ChatInvite } from "@app/models/chatInvite.model"
import RateLimit from "@app/lib/graphql/RateLimit"
import { Chat } from "@app/models/chat.model"
import { JoinChatFromInviteInput } from "@app/classes/graphql/chat/invites/joinInvite"
import { Op } from "sequelize"
import { ChatRank } from "@app/models/chatRank.model"
import { UserUtilsService } from "@app/services/userUtils.service"
import { User } from "@app/models/user.model"
import { LegacyUser } from "@app/models/legacyUser.model"

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

  @FieldResolver(() => ChatInvite)
  async invite(@Root() assoc: ChatAssociation) {
    return await assoc.$get("invite")
  }

  @RateLimit({
    window: 10,
    max: 10
  })
  @Authorization({
    scopes: ["chats.edit"],
    emailOptional: true
  })
  @Mutation(() => ChatAssociation)
  async joinChatFromInvite(
    @Ctx() ctx: Context,
    @Arg("input") input: JoinChatFromInviteInput
  ) {
    const invite = await ChatInvite.findOne({
      where: {
        id: input.inviteId,
        invalidated: false,
        expiredAt: {
          [Op.or]: [
            {
              [Op.gt]: new Date()
            },
            {
              [Op.is]: null
            }
          ]
        }
      },
      include: [
        {
          model: ChatRank,
          as: "rank"
        },
        {
          model: Chat,
          as: "chat"
        }
      ]
    })
    if (!invite) throw new GqlError("INVALID_INVITE")
    const existing = await ChatAssociation.findOne({
      where: {
        userId: ctx.user!!.id,
        chatId: invite.chat.id
      }
    })
    console.log(existing)
    if (existing) throw new GqlError("ALREADY_IN_CHAT")
    const rank = invite.rank
      ? invite.rank
      : await ChatRank.findOne({
          where: {
            chatId: invite.chat.id,
            managed: true
          }
        })

    if (!rank) throw new GqlError("COLUBRINA_CHAT")

    const association = await ChatAssociation.create({
      userId: ctx.user!!.id,
      chatId: invite.chat.id,
      rank: "member",
      identifier: invite.chat.id + "-" + ctx.user!!.id,
      inviteUsed: invite.id
    })
    await ChatRankAssociation.create({
      rankId: rank.id,
      chatAssociationId: association.id
    })
    this.chatService.sendMessage(
      `<@${ctx.user!!.id}> joined the chat via an invite!`,
      ctx.user!!.id,
      association.id,
      undefined,
      "join"
    )
    const associations = await ChatAssociation.findAll({
      where: {
        chatId: invite.chat.id
      },
      include: [
        {
          model: User,
          as: "tpuUser",
          attributes: partialUserBase
        },
        {
          model: LegacyUser,
          as: "legacyUser",
          attributes: partialUserBase
        }
      ]
    })
    for (const association of associations) {
      Container.get(UserUtilsService).trackedUserIds(association.userId, true)
    }
    const emitUser = await ChatAssociation.findOne({
      where: {
        id: association.id
      },
      include: [
        {
          model: User,
          as: "tpuUser",
          attributes: partialUserBase
        },
        {
          model: LegacyUser,
          as: "legacyUser",
          attributes: partialUserBase
        },
        {
          model: ChatRank,
          as: "ranks"
        }
      ]
    })
    if (!emitUser) throw new GqlError("USER_NOT_FOUND")
    emitUser.dataValues.ranksMap = emitUser.dataValues.ranks.map(
      (rank: ChatRank) => rank.id
    )
    this.chatService.emitForAll(association.id, ctx.user!!.id, "addChatUsers", {
      chatId: invite.chat.id,
      users: [emitUser]
    })
    socket
      .of(SocketNamespaces.CHAT)
      .to(emitUser.userId)
      .emit(
        "chatCreated",
        await this.chatService.getChat(invite.chat.id, association.userId)
      )
    return emitUser
  }
}
