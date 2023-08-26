import { Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql"
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

@Resolver(Chat)
@Service()
export class ChatResolver {
  constructor() {}

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
}
