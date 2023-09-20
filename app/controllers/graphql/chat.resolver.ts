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
import { Chat } from "@app/models/chat.model"
import { Context } from "@app/types/graphql/context"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import {
  partialUserBase,
  PartialUserBase
} from "@app/classes/graphql/user/partialUser"
import { User } from "@app/models/user.model"
import { LegacyUser } from "@app/models/legacyUser.model"
import { Op } from "sequelize"
import { CreateChatInput } from "@app/classes/graphql/chat/createChat"
import RateLimit from "@app/lib/graphql/RateLimit"
import { ChatService } from "@app/services/chat.service"
import { UpdateChatInput } from "@app/classes/graphql/chat/updateChat"
import { ChatInput } from "@app/classes/graphql/chat/chat"
import { GraphQLError } from "graphql/error"
import { ChatRank } from "@app/models/chatRank.model"
import { ChatPermission } from "@app/models/chatPermission.model"

@Resolver(Chat)
@Service()
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  @Authorization({
    scopes: ["chats.view"],
    userOptional: true
  })
  @Query(() => [Chat])
  async chats(@Ctx() ctx: Context) {
    if (!ctx.user) return []
    return await Chat.findAll({
      include: [
        {
          model: ChatAssociation,
          where: { userId: ctx.user.id },
          required: true,
          as: "association"
        }
      ]
    })
  }

  @FieldResolver(() => Number)
  async unread(@Root() chat: Chat, @Ctx() ctx: Context): Promise<Number> {
    const unreads = await redis.json.get(`unread:${ctx.user!!.id}`)
    return unreads[chat.id.toString()] || 0
  }

  @Authorization({
    scopes: ["chats.view"]
  })
  @Query(() => Chat)
  async chat(@Ctx() ctx: Context, @Arg("input") input: ChatInput) {
    if (!ctx.user) return null
    if (!input.chatId && !input.associationId)
      throw new GraphQLError("Field `chatId` or `associationId` is required.")

    const where = input.chatId
      ? { id: input.chatId }
      : { id: input.associationId, userId: ctx.user.id }

    return await Chat.findOne({
      where: input.chatId ? where : {},
      include: [
        {
          model: ChatAssociation,
          where: input.chatId ? { userId: ctx.user.id } : where,
          required: true,
          as: "association"
        }
      ]
    })
  }

  @FieldResolver(() => PartialUserBase)
  async user(@Root() chat: Chat): Promise<PartialUserBase> {
    return (await chat.$get("user", {
      attributes: partialUserBase
    })) as PartialUserBase
  }

  @FieldResolver(() => PartialUserBase)
  async legacyUser(@Root() chat: Chat): Promise<PartialUserBase> {
    return (await chat.$get("legacyUser", {
      attributes: partialUserBase
    })) as PartialUserBase
  }

  @FieldResolver(() => [ChatAssociation])
  async users(@Root() chat: Chat) {
    return await chat.$get("users")
  }

  @FieldResolver(() => String)
  async _redisSortDate(@Root() chat: Chat) {
    return (await redis.get(`chat:${chat.id}:sortDate`)) || "0"
  }

  @FieldResolver(() => PartialUserBase || null, {
    nullable: true
  })
  async recipient(
    @Root() chat: Chat,
    @Ctx() ctx: Context
  ): Promise<PartialUserBase | null> {
    if (chat.type !== "direct" || !ctx.user) return null
    const user = await ChatAssociation.findOne({
      attributes: ["userId", "legacyUserId", "user"],
      where: {
        chatId: chat.id,
        userId: {
          [Op.ne]: ctx.user.id
        }
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
    return user?.user as PartialUserBase | null
  }

  @RateLimit({
    window: 10,
    max: 3
  })
  @Authorization({
    scopes: ["chats.create"]
  })
  @Mutation(() => Chat)
  async createChat(
    @Ctx() ctx: Context,
    @Arg("input") input: CreateChatInput
  ): Promise<Chat> {
    return await this.chatService.createChat(input.users, ctx.user!!.id)
  }

  @RateLimit({
    window: 10,
    max: 10
  })
  @Authorization({
    scopes: ["chats.edit"]
  })
  @Mutation(() => Chat)
  async updateChat(@Ctx() ctx: Context, @Arg("input") input: UpdateChatInput) {
    await this.chatService.updateGroupSettings(
      input.associationId,
      ctx.user!!.id,
      input
    )

    return this.chat(ctx, {
      associationId: input.associationId
    })
  }

  @FieldResolver(() => [ChatRank])
  async ranks(@Root() chat: Chat) {
    return await chat.$get("ranks", {
      order: [["index", "DESC"]]
    })
  }

  @Query(() => [ChatPermission])
  async availableChatPermissions() {
    return await ChatPermission.findAll()
  }
}
