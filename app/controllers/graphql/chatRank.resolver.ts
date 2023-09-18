import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  Resolver,
  Root
} from "type-graphql"
import { Service } from "typedi"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import {
  partialUserBase,
  PartialUserBase
} from "@app/classes/graphql/user/partialUser"
import { ChatPermission } from "@app/models/chatPermission.model"
import { ChatRank } from "@app/models/chatRank.model"
import RateLimit from "@app/lib/graphql/RateLimit"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { Context } from "@app/types/graphql/context"
import {
  CreateRank,
  UpdateRank,
  UpdateRankOrder
} from "@app/classes/graphql/chat/ranks/updateRank"
import { ChatPermissions } from "@app/classes/graphql/chat/ranks/permissions"
import { ChatService } from "@app/services/chat.service"
import { GraphQLError } from "graphql/error"
import { ChatPermissionAssociation } from "@app/models/chatPermissionAssociation.model"
import { ChatRankAssociation } from "@app/models/chatRankAssociation.model"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import { ChatPermissionsHandler } from "@app/services/chat/permissions"

@Resolver(ChatRank)
@Service()
export class ChatRankResolver {
  constructor(private chatService: ChatService) {}

  @FieldResolver(() => [ChatPermission])
  async permissions(@Root() chatRank: ChatRank) {
    return await chatRank.$get("permissions")
  }

  @FieldResolver(() => [String])
  async permissionsMap(@Root() chatRank: ChatRank) {
    const permissions = await chatRank.$get("permissions")
    return permissions.map((permission) => permission.id)
  }

  @RateLimit({
    window: 8,
    max: 20
  })
  @Authorization({
    scopes: ["chats.edit"]
  })
  @Mutation(() => ChatRank)
  async updateChatRank(@Ctx() ctx: Context, @Arg("input") input: UpdateRank) {
    await this.chatService.checkPermissions(
      ctx.user!!.id,
      input.associationId,
      ChatPermissions.MANAGE_RANKS
    )
    const chat = await this.chatService.getChatFromAssociation(
      input.associationId,
      ctx.user!!.id
    )
    const rank = await ChatRank.findOne({
      where: { id: input.rankId, chatId: chat.id },
      include: [
        {
          model: ChatPermission,
          as: "permissions"
        },
        {
          model: ChatAssociation,
          as: "associations"
        }
      ]
    })
    if (!rank) throw new GraphQLError("Rank not found.")

    // prevent duplicates by using Set
    const inputPermissions = new Set(input.permissionsMap)

    const validate = await ChatPermission.count({
      where: {
        id: input.permissionsMap
      }
    })

    if (validate !== inputPermissions.size)
      throw new GraphQLError("Permission not valid.")

    const rankPermissionIds = rank.permissions.map(
      (permission) => permission.id
    )

    const permissionsToAdd = [...inputPermissions].filter(
      (permissionId) => !rankPermissionIds.includes(permissionId)
    )
    const permissionsToRemove = rankPermissionIds.filter(
      (permissionId) => !inputPermissions.has(permissionId)
    )

    await Promise.all(
      permissionsToAdd.map(async (permissionId) => {
        await ChatPermissionAssociation.create({
          permissionId: permissionId,
          rankId: rank.id
        })
      })
    )

    await Promise.all(
      permissionsToRemove.map(async (permissionId) => {
        const permissionIndex = rank.permissions.findIndex(
          (permission) => permission.id === permissionId
        )
        if (permissionIndex !== -1) {
          await ChatPermissionAssociation.destroy({
            where: { rankId: rank.id, permissionId }
          })
        }
      })
    )

    if (input.name || input.color) {
      await rank.update({
        name: input.name ?? rank.name,
        color: input.color ?? rank.color
      })
    }

    for (const association of rank.associations) {
      this.chatService.syncPermissions(association.userId, association.id)
    }

    this.chatService.emitForAll(
      input.associationId,
      ctx.user!!.id,
      "rankUpdated",
      {
        permissionsMap: input.permissionsMap,
        name: input.name ?? rank.name,
        color: input.color ?? rank.color,
        id: rank.id,
        userId: rank.userId,
        createdAt: rank.createdAt,
        chatId: rank.chatId,
        updatedAt: rank.updatedAt,
        managed: rank.managed,
        index: rank.index
      }
    )

    return rank
  }

  @RateLimit({
    window: 8,
    max: 8
  })
  @Authorization({
    scopes: ["chats.edit"]
  })
  @Mutation(() => ChatRank)
  async addChatRank(@Ctx() ctx: Context, @Arg("input") input: CreateRank) {
    if (!input.name) throw new GraphQLError("Name is required.")
    await this.chatService.checkPermissions(
      ctx.user!!.id,
      input.associationId,
      ChatPermissions.MANAGE_RANKS
    )
    const chat = await this.chatService.getChatFromAssociation(
      input.associationId,
      ctx.user!!.id
    )

    const rank = await ChatRank.create({
      chatId: chat.id,
      name: input.name,
      color: input.color,
      userId: ctx.user!!.id,
      index: 2
    })
    const permissions = []
    const permissionHandler = new ChatPermissionsHandler()
    for (const permission of permissionHandler.memberPermissions) {
      permissions.push({
        rankId: rank.id,
        permissionId: permission
      })
    }
    await ChatPermissionAssociation.bulkCreate(permissions)
    this.chatService.emitForAll(
      input.associationId,
      ctx.user!!.id,
      "rankUpdated",
      {
        permissionsMap: permissions.map((perm) => perm.permissionId),
        name: input.name ?? rank.name,
        color: input.color ?? rank.color,
        id: rank.id,
        userId: rank.userId,
        createdAt: rank.createdAt,
        chatId: rank.chatId,
        updatedAt: rank.updatedAt,
        managed: rank.managed,
        index: rank.index
      }
    )
    this.chatService.normalizeIndexes(chat.id)
    return rank
  }

  @RateLimit({
    window: 8,
    max: 8
  })
  @Authorization({
    scopes: ["chats.edit"]
  })
  @Mutation(() => [ChatRank])
  async updateChatRankOrder(
    @Ctx() ctx: Context,
    @Arg("input") input: UpdateRankOrder
  ) {
    await this.chatService.checkPermissions(
      ctx.user!!.id,
      input.associationId,
      ChatPermissions.MANAGE_RANKS
    )
    const chat = await this.chatService.getChatFromAssociation(
      input.associationId,
      ctx.user!!.id
    )
    if (!chat) throw new GraphQLError("Chat not found.")
    const ranks = await ChatRank.findAll({
      where: { chatId: chat.id }
    })
    const inputRanks = input.rankIds.reverse()
    const validRankIds = ranks.map((rank) => rank.id)
    const isValidRankIds = inputRanks.every((id) => validRankIds.includes(id))
    if (!isValidRankIds) {
      throw new GraphQLError("Invalid `rankIds` provided.")
    }

    for (const rank of ranks) {
      await rank.update({
        index: inputRanks.indexOf(rank.id)
      })
    }
    this.chatService.normalizeIndexes(chat.id)
    return ranks
  }
}
