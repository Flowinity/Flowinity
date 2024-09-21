import { gql } from "@apollo/client";

const UpdateEmojiMutation = gql`
  mutation UpdateEmoji($input: UpdateEmojiInput!) {
    updateEmoji(input: $input) {
      name
    }
  }
`;
