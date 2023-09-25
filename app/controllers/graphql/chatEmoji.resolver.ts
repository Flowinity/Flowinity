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
import { ChatEmoji } from "@app/models/chatEmoji.model"
import { Context } from "@app/types/graphql/context"
import { ChatService } from "@app/services/chat.service"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { ChatResolver } from "@app/controllers/graphql/chat.resolver"

@Resolver(ChatEmoji)
@Service()
export class ChatEmojiResolver {
  constructor(private chatService: ChatService) {}

  @Authorization({
    scopes: ["chats.view"],
    userOptional: true
  })
  @Query(() => [ChatEmoji])
  async userEmoji(@Ctx() ctx: Context, reset = false): Promise<ChatEmoji[]> {
    if (!ctx.user) return []
    return await this.chatService.userEmoji(ctx.user.id, false)
  }
}
