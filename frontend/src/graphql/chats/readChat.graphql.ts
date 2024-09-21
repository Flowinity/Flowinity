import { gql } from "@apollo/client";

const ReadChatMutation = gql`
  mutation ReadChat($input: ReadChatInput!) {
    readChat(input: $input) {
      success
    }
  }
`;
