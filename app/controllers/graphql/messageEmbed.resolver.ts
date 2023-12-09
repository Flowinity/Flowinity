import { Service } from "typedi"
import { Arg, Resolver, Root, Subscription } from "type-graphql"
import {
  EmbedDataV2,
  EmbedResolutionFilter
} from "@app/classes/graphql/chat/embeds"
import { Authorization } from "@app/lib/graphql/AuthChecker"

@Service()
@Resolver(EmbedDataV2)
export class EmbedDataV2Resolver {
  constructor() {}

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
}
