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
import { UpdateEmojiInput } from "@app/classes/graphql/emoji/updateEmoji"
import { GqlError } from "@app/lib/gqlErrors"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import RateLimit from "@app/lib/graphql/RateLimit"

@Resolver(ChatEmoji)
@Service()
export class ChatEmojiResolver {
  constructor(private chatService: ChatService) {}

  slugify(str: string) {
    return String(str)
      .normalize("NFKD") // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-") // remove consecutive hyphens
  }

  @Authorization({
    scopes: ["chats.view"],
    userOptional: true
  })
  @Query(() => [ChatEmoji])
  async userEmoji(@Ctx() ctx: Context): Promise<ChatEmoji[]> {
    if (!ctx.user) return []
    return await this.chatService.userEmoji(ctx.user.id, false)
  }

  @RateLimit({
    window: 8,
    max: 8
  })
  @Authorization({
    scopes: ["chats.edit"]
  })
  @Mutation(() => ChatEmoji)
  async updateEmoji(
    @Ctx() ctx: Context,
    @Arg("input") input: UpdateEmojiInput
  ) {
    const chat = await this.chatService.getChatFromAssociation(
      input.associationId,
      ctx.user!!.id
    )
    const emoji = await ChatEmoji.findOne({
      where: {
        id: input.id,
        chatId: chat.id
      }
    })
    if (!emoji) throw new GqlError("INVALID_EMOJI")
    const name = this.slugify(input.name)
    if (name.includes("~")) throw new GqlError("ILLEGAL_EMOJI_CHARACTER")
    await emoji.update({
      name
    })
    for (const user of chat.users) {
      if (!user.userId) continue
      const emojis = await this.chatService.userEmoji(user.userId, true)
      socket
        .of(SocketNamespaces.CHAT)
        .to(user.userId)
        .emit("emojiUpdated", {
          id: input.id,
          name: emojis.find((emoji) => emoji.id === input.id)?.name
        })
    }
    return {
      ...emoji.toJSON(),
      name
    }
  }
}
