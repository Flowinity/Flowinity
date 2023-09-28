import { gql } from "@apollo/client";

export const DeleteEmojiMutation = gql`
  mutation DeleteEmoji($input: DeleteEmojiInput!) {
    deleteEmoji(input: $input) {
      success
    }
  }
`;
