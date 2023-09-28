import { gql } from "@apollo/client";

export const UpdateEmojiMutation = gql`
  mutation UpdateEmoji($input: UpdateEmojiInput!) {
    updateEmoji(input: $input) {
      name
    }
  }
`;
