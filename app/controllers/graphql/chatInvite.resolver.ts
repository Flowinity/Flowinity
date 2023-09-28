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
import { ChatService } from "@app/services/chat.service"
import { Context } from "@app/types/graphql/context"
import { ChatPermissions } from "@app/classes/graphql/chat/ranks/permissions"
import { ChatInvite } from "@app/models/chatInvite.model"
import { CreateInviteInput } from "@app/classes/graphql/chat/invites/createInvite"
import RateLimit from "@app/lib/graphql/RateLimit"
import cryptoRandomString from "crypto-random-string"
import { ChatRank } from "@app/models/chatRank.model"
import { GqlError } from "@app/lib/gqlErrors"
import { InviteInput } from "@app/classes/graphql/chat/invites/getInvite"
import { Op } from "sequelize"
import { Chat } from "@app/models/chat.model"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@Resolver(ChatInvite)
@Service()
export class ChatInviteResolver {
  constructor(private chatService: ChatService) {}

  @RateLimit({
    window: 12,
    max: 5
  })
  @Authorization({
    scopes: ["chats.edit"]
  })
  @Mutation(() => ChatInvite)
  async createChatInvite(
    @Ctx() ctx: Context,
    @Arg("input") input: CreateInviteInput
  ) {
    const permissions = await this.chatService.checkPermissions(
      ctx.user!!.id,
      input.associationId,
      ChatPermissions.INVITE_USERS
    )

    const chat = await this.chatService.getChatFromAssociation(
      input.associationId,
      ctx.user!!.id
    )

    if (input.rankId) {
      const highestIndex = await this.chatService.getHighestIndex(
        input.associationId
      )
      const rank = await ChatRank.findOne({
        where: {
          chatId: chat.id,
          id: input.rankId
        }
      })
      if (!rank) throw new GqlError("RANK_NOT_FOUND")
      if (
        rank.index > highestIndex &&
        !permissions.includes(ChatPermissions.OWNER)
      )
        throw new GqlError("RANK_TOO_HIGH")
    }

    const date = new Date()

    return await ChatInvite.create({
      id: cryptoRandomString({
        length: 10
      }),
      expiredAt: input.expiry
        ? date.setHours(date.getHours() + input.expiry)
        : null,
      chatId: chat.id,
      rankId: input.rankId ?? null,
      userId: ctx.user!!.id
    })
  }

  @Query(() => ChatInvite, {
    nullable: true
  })
  async chatInvite(@Ctx() ctx: Context, @Arg("input") input: InviteInput) {
    return await ChatInvite.findOne({
      where: {
        id: input.inviteId,
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
      }
    })
  }

  @FieldResolver(() => Chat)
  async chat(@Root() invite: ChatInvite) {
    return await invite.$get("chat")
  }

  @FieldResolver(() => PartialUserBase)
  async user(@Root() invite: ChatInvite) {
    return await invite.$get("user")
  }

  @FieldResolver(() => ChatRank)
  async rank(@Root() invite: ChatInvite) {
    return await invite.$get("rank")
  }
}
