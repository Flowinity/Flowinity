import { Service } from "typedi"
import { Arg, Mutation, Resolver, Root, Subscription } from "type-graphql"
import {
  EmbedDataV2,
  EmbedPrecacheInput,
  EmbedResolutionEvent,
  EmbedResolutionFilter
} from "@app/classes/graphql/chat/embeds"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { ChatService } from "@app/services/chat.service"
import RateLimit from "@app/lib/graphql/RateLimit"
import { embedGenerator, embedTranslator } from "@app/lib/embedParser"
import { GraphQLError } from "graphql/error"

@Service()
@Resolver(EmbedDataV2)
export class EmbedDataV2Resolver {
  constructor(private readonly chatService: ChatService) {}

  @Authorization({
    scopes: ["chats.view"]
  })
  @Subscription(() => EmbedResolutionEvent, {
    topics: ({ context }) => {
      return `EMBED_RESOLUTION:${context.user!!.id}`
    },
    filter: ({ payload, args }) => {
      if (!args.input) return true
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
    @Root() data: EmbedResolutionEvent,
    @Arg("input", {
      nullable: true
    })
    input: EmbedResolutionFilter
  ): Promise<EmbedResolutionEvent> {
    console.log(data)
    return data
  }

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
    console.log(precache)
    const key = `embedResolution:${input.url ? "url" : "attachment"}:${
      input.url || input.attachment
    }`

    if (precache[0]) {
      redis.json.set(
        key,
        "$",
        precache[0],
        {
          ttl: 60 * 60
        },
        true
      )
      return precache[0]
    }
    return null
  }
}
