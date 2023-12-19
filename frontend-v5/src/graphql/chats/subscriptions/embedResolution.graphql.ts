import { gql } from "@apollo/client";
import { StandardEmbedFragment } from "@/graphql/chats/messages.graphql";

export const EmbedResolutionSubscription = gql`
  ${StandardEmbedFragment}
  subscription EmbedResolution {
    onEmbedResolution {
      associationId
      message {
        id
        embeds {
          ...StandardEmbed
        }
      }
    }
  }
`;
