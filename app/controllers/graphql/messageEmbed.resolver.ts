import { Service } from "typedi"
import { Arg, Mutation, Resolver } from "type-graphql"
import {
  EmbedDataV2,
  EmbedPrecacheInput
} from "@app/classes/graphql/chat/embeds"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { ChatService } from "@app/services/chat.service"
import RateLimit from "@app/lib/graphql/RateLimit"
import { embedGenerator } from "@app/lib/embedParser"
import { GraphQLError } from "graphql/error"

@Service()
@Resolver(EmbedDataV2)
export class EmbedDataV2Resolver {
  constructor(private readonly chatService: ChatService) {}

  @Authorization({
    scopes: ["chats.view"]
  })
  @RateLimit({
    window: 10,
    max: 5
  })
  @Mutation(() => EmbedDataV2, {
    nullable: true
  })
  async embedResolutionPrecache(
    @Arg("input", () => EmbedPrecacheInput)
    input: EmbedPrecacheInput
  ): Promise<EmbedDataV2 | null> {
    if (!input.url && !input.attachment)
      throw new GraphQLError(
        "You must provide a URL or Flowinity attachment in the format of a1234567.png"
      )
    const precache = await embedGenerator(
      input.url ? [input.url] : [],
      input.attachment ? [input.attachment] : []
    )

    return precache[0] || null
  }
}
