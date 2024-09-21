import { gql } from "@apollo/client";

const UpdateChatMutation = gql`
  mutation UpdateChat($input: UpdateChatInput!) {
    updateChat(input: $input) {
      id
    }
  }
`;
