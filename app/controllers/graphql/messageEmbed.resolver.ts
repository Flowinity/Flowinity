import { Service } from "typedi"
import { Arg, Mutation, Resolver, Root, Subscription } from "type-graphql"
import {
  EmbedDataV2,
  EmbedPrecacheInput,
  EmbedResolutionFilter
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
  @Subscription(() => EmbedDataV2, {
    topics: ({ context }) => {
      return `EMBED_RESOLUTION:${context.user!!.id}`
    },
    filter: ({ payload, args }) => {
      if (args.input.associationId !== undefined) {
        return args.input.associationId === payload.associationId
      }
      if (args.input.messageId !== undefined) {
        return args.input.messageId === payload.message?.id
      }
      return true
    }
  })
  async embedResolution(
    @Root() data: EmbedDataV2,
    @Arg("input", {
      nullable: true
    })
    input: EmbedResolutionFilter
  ): Promise<EmbedDataV2> {
    return data
  }

  @Authorization({
    scopes: ["chats.view"]
  })
  @RateLimit({
    window: 10,
    max: 5
  })
  @Mutation(() => EmbedDataV2)
  async embedResolutionPrecache(
    @Arg("input", () => EmbedPrecacheInput)
    input: EmbedPrecacheInput
  ): Promise<EmbedDataV2> {
    if (!input.url && !input.attachment)
      throw new GraphQLError(
        "You must provide a URL or Flowinity attachment in the format of a1234567.png"
      )
    const precache = await embedGenerator(
      input.url ? [input.url] : [],
      input.attachment ? [input.attachment] : []
    )
    const key = `embedResolution:${input.url || input.attachment}`
    redis.json.set(
      key,
      "$",
      precache,
      {
        ttl: 60 * 60
      },
      true
    )
    return precache[0]
  }
}
