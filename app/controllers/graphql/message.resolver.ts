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
import { Message } from "@app/models/message.model"
import { ChatService } from "@app/services/chat.service"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { SendMessageInput } from "@app/classes/graphql/chat/sendMessage"
import { Context } from "@app/types/graphql/context"
import RateLimit from "@app/lib/graphql/RateLimit"
import {
  InfiniteMessagesInput,
  PagedMessagesInput,
  ScrollPosition
} from "@app/classes/graphql/chat/message"
import { Op, WhereOptions } from "sequelize"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { Chat } from "@app/models/chat.model"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { PagerResponse } from "@app/classes/graphql/gallery/galleryResponse"
import paginate from "jw-paginate"

export const PaginatedMessagesResponse = PagerResponse(Message)
export type PaginatedMessagesResponse = InstanceType<
  typeof PaginatedMessagesResponse
>

@Resolver(Message)
@Service()
export class MessageResolver {
  constructor(private readonly chatService: ChatService) {}

  @RateLimit({
    window: 8,
    max: 8
  })
  @Authorization({
    scopes: ["chats.send"]
  })
  @Mutation(() => Message)
  async sendMessage(
    @Arg("input") input: SendMessageInput,
    @Ctx() ctx: Context
  ): Promise<Message> {
    return await this.chatService.sendMessage(
      input.content,
      ctx.user!!.id,
      input.associationId,
      input.replyId,
      "message",
      input.attachments
    )
  }

  @Authorization({
    scopes: ["chats.view"]
  })
  @Query(() => [Message])
  async messages(
    @Arg("input") input: InfiniteMessagesInput,
    @Ctx() ctx: Context
  ): Promise<Message[]> {
    const chat = await this.chatService.getChatFromAssociation(
      input.associationId,
      ctx.user!!.id,
      true
    )
    let where = {} as WhereOptions<Message>
    if (!ctx.meta.paged) {
      where = input.offset
        ? input.position === ScrollPosition.TOP
          ? { id: { [Op.lt]: input.offset } }
          : { id: { [Op.gt]: input.offset } }
        : {}
    }

    if (input.search?.pins) {
      where = {
        ...where,
        pinned: true
      }
    }

    if (input.search) {
      const { query, userId, before, after } = input.search

      where = {
        ...where,
        ...(query && { content: { [Op.like]: `%${query}%` } }),
        ...(userId && { userId: userId }),
        ...(before && { createdAt: { [Op.lt]: before } }),
        ...(after && { createdAt: { [Op.gt]: after } })
      }
    }
    let messages = await Message.findAll({
      where: {
        chatId: chat.id,
        ...where
      },
      order: [["id", input.position === ScrollPosition.TOP ? "DESC" : "ASC"]],
      limit: input.limit,
      offset: ctx.meta.paged ? input.offset : undefined
    })
    if (input.position === ScrollPosition.BOTTOM) messages.reverse()
    if (ctx.meta.paged) {
      ctx.meta.query = {
        where: {
          chatId: chat.id,
          ...where
        },
        order: [["id", input.position === ScrollPosition.TOP ? "DESC" : "ASC"]],
        limit: input.limit
      }
    }
    return messages
  }

  @Authorization({
    scopes: ["chats.view"]
  })
  @Query(() => PaginatedMessagesResponse)
  async messagesPaged(
    @Arg("input") input: PagedMessagesInput,
    @Ctx() ctx: Context
  ): Promise<PaginatedMessagesResponse> {
    ctx.meta.paged = true
    const offset = (input.page - 1) * input.limit
    const messages = await this.messages(
      {
        ...input,
        offset
      } as InfiniteMessagesInput,
      ctx
    )
    const count = await Message.count({
      where: ctx.meta.query.where
    })
    const pager = paginate(count || messages.length, input.page, input.limit)
    return {
      pager,
      items: messages
    }
  }

  @FieldResolver(() => [ChatAssociation])
  async readReceipts(@Ctx() ctx: Context, @Root() message: Message) {
    return await message.$get("readReceipts", {
      attributes: {
        exclude: ["updatedAt"]
      }
    })
  }

  @FieldResolver(() => Chat)
  async chat(@Root() message: Message) {
    return await message.$get("chat")
  }

  @FieldResolver(() => PartialUserBase)
  async user(@Root() message: Message) {
    return (await message.$get("tpuUser")) || (await message.$get("legacyUser"))
  }

  @FieldResolver(() => PartialUserBase)
  async tpuUser(@Root() message: Message) {
    return await message.$get("tpuUser")
  }

  @FieldResolver(() => PartialUserBase)
  async legacyUser(@Root() message: Message) {
    return await message.$get("legacyUser")
  }

  @FieldResolver(() => Message)
  async reply(@Root() message: Message) {
    return await message.$get("reply")
  }
}
