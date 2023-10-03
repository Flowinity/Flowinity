import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root } from "type-graphql"
import { Service } from "typedi"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { ChatPermission } from "@app/models/chatPermission.model"
import { ChatRank } from "@app/models/chatRank.model"
import RateLimit from "@app/lib/graphql/RateLimit"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { Context } from "@app/types/graphql/context"
import {
  CreateRank,
  DeleteRank,
  UpdateRank,
  UpdateRankOrder
} from "@app/classes/graphql/chat/ranks/updateRank"
import { ChatPermissions } from "@app/classes/graphql/chat/ranks/permissions"
import { ChatService } from "@app/services/chat.service"
import { GraphQLError } from "graphql/error"
import { ChatPermissionAssociation } from "@app/models/chatPermissionAssociation.model"
import { ChatPermissionsHandler } from "@app/services/chat/permissions"
import { GqlError } from "@app/lib/gqlErrors"
import { ChatAuditLog } from "@app/models/chatAuditLog.model"
import {
  AuditLogActionType,
  AuditLogCategory
} from "@app/classes/graphql/chat/auditLog/categories"
import { Success } from "@app/classes/graphql/generic/success"

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
    const permissions = await this.chatService.checkPermissions(
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
    const highestIndex = await this.chatService.getHighestIndex(
      input.associationId
    )
    if (!rank) throw new GraphQLError("Rank not found.")
    if (
      (rank.index >= highestIndex &&
        !permissions.includes(ChatPermissions.TRUSTED) &&
        !permissions.includes(ChatPermissions.OWNER)) ||
      (!permissions.includes(ChatPermissions.OWNER) &&
        permissions.includes(ChatPermissions.TRUSTED) &&
        rank.index > highestIndex)
    )
      throw new GqlError("RANK_TOO_HIGH")
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
        if (
          permissionId === ChatPermissions.TRUSTED &&
          ctx.user!!.id !== chat.userId
        ) {
          throw new GraphQLError(
            "Only the group owner can update the Trusted User permission."
          )
        }

        if (
          !permissions.includes(permissionId as ChatPermissions) &&
          (!permissions.includes(ChatPermissions.OWNER) ||
            !permissions.includes(ChatPermissions.ADMIN))
        ) {
          throw new GraphQLError(
            `You don't have the ${permissionId} permission you are trying to grant.`
          )
        }

        await ChatPermissionAssociation.create({
          permissionId: permissionId,
          rankId: rank.id
        })
      })
    )

    await Promise.all(
      permissionsToRemove.map(async (permissionId) => {
        if (
          permissionId === ChatPermissions.TRUSTED &&
          ctx.user!!.id !== chat.userId
        ) {
          throw new GraphQLError(
            "Only the group owner can update the Trusted User permission."
          )
        }

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

    if (permissionsToAdd.length || permissionsToRemove.length) {
      await ChatAuditLog.create({
        chatId: chat.id,
        userId: ctx.user!!.id,
        category: AuditLogCategory.RANK,
        actionType: AuditLogActionType.MODIFY,
        message: `<@${ctx.user!!.id}> added ${
          permissionsToAdd.length
        } additional permissions, and removed ${
          permissionsToRemove.length
        } permissions from the rank **${rank.name}**`
      })
    }

    if (input.name || input.color) {
      await rank.update({
        name: input.name ?? rank.name,
        color: input.color ?? rank.color
      })
      if (input.name !== rank.name || input.color !== rank.color) {
        await ChatAuditLog.create({
          chatId: chat.id,
          userId: ctx.user!!.id,
          category: AuditLogCategory.RANK,
          actionType: AuditLogActionType.MODIFY,
          message:
            input.name !== rank.name
              ? `<@${ctx.user!!.id}> updated the rank name from **${
                  rank.name
                }** to **${input.name}**`
              : `<@${ctx.user!!.id}> updated the rank color from **${
                  rank.color
                }** to **${input.color}**`
        })
      }
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
      index: 1
    })
    const permissions = []
    const permissionHandler = new ChatPermissionsHandler()
    for (const permission of permissionHandler.memberPermissions) {
      permissions.push({
        rankId: rank.id,
        permissionId: permission
      })
    }
    await ChatAuditLog.create({
      chatId: chat.id,
      userId: ctx.user!!.id,
      category: AuditLogCategory.RANK,
      actionType: AuditLogActionType.ADD,
      message: `<@${ctx.user!!.id}> created the rank **${rank.name}**`
    })
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

    const highestIndex = await this.chatService.getHighestIndex(
      input.associationId
    )

    await ChatAuditLog.create({
      chatId: chat.id,
      userId: ctx.user!!.id,
      category: AuditLogCategory.RANK,
      actionType: AuditLogActionType.MODIFY,
      message: `<@${ctx.user!!.id}> updated the rank order.`
    })

    for (const rank of ranks) {
      const newIndex = inputRanks.indexOf(rank.id)
      if (
        (newIndex >= highestIndex || rank.index >= highestIndex) &&
        rank.index !== newIndex &&
        ctx.user!!.id !== chat.userId
      ) {
        this.chatService.normalizeIndexes(chat.id)
        throw new GqlError("RANK_TOO_HIGH")
      }
      await rank.update({
        index: inputRanks.indexOf(rank.id)
      })
    }
    this.chatService.normalizeIndexes(chat.id)
    return ranks
  }

  @FieldResolver(() => [ChatAssociation])
  async associations(@Root() chatRank: ChatRank) {
    return await chatRank.$get("associations")
  }

  @RateLimit({
    window: 8,
    max: 8
  })
  @Authorization({
    scopes: ["chats.edit"]
  })
  @Mutation(() => Success)
  async deleteChatRank(@Ctx() ctx: Context, @Arg("input") input: DeleteRank) {
    const permissions = await this.chatService.checkPermissions(
      ctx.user!!.id,
      input.associationId,
      ChatPermissions.MANAGE_RANKS
    )
    const chat = await this.chatService.getChatFromAssociation(
      input.associationId,
      ctx.user!!.id
    )
    const rank = await ChatRank.findOne({
      where: {
        id: input.rankId,
        chatId: chat.id,
        managed: false
      }
    })
    if (!rank) throw new GqlError("RANK_NOT_FOUND")
    const highestIndex = await this.chatService.getHighestIndex(
      input.associationId
    )
    if (
      (rank.index >= highestIndex &&
        !permissions.includes(ChatPermissions.TRUSTED) &&
        !permissions.includes(ChatPermissions.OWNER)) ||
      (!permissions.includes(ChatPermissions.OWNER) &&
        permissions.includes(ChatPermissions.TRUSTED) &&
        rank.index > highestIndex)
    )
      throw new GqlError("RANK_TOO_HIGH")
    await rank.destroy()
    await ChatAuditLog.create({
      chatId: chat.id,
      userId: ctx.user!!.id,
      category: AuditLogCategory.RANK,
      actionType: AuditLogActionType.REMOVE,
      message: `<@${ctx.user!!.id}> deleted the rank **${rank.name}**.`
    })
    this.chatService.emitForAll(
      input.associationId,
      ctx.user!!.id,
      "rankDeleted",
      {
        id: rank.id,
        chatId: chat.id
      }
    )
    for (const association of chat.users) {
      this.chatService.syncPermissions(association.userId, association.id)
    }
    return { success: true }
  }
}
