import { gql } from "@apollo/client";

const DeleteEmojiMutation = gql`
  mutation DeleteEmoji($input: DeleteEmojiInput!) {
    deleteEmoji(input: $input) {
      success
    }
  }
`;
