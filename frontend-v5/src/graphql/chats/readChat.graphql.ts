import { gql } from "@apollo/client";

export const ReadChatMutation = gql`
  mutation ReadChat($input: ReadChatInput!) {
    readChat(input: $input) {
      success
    }
  }
`;
