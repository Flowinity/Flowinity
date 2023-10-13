import { gql } from "@apollo/client";

export const UpdateChatMutation = gql`
  mutation UpdateChat($input: UpdateChatInput!) {
    updateChat(input: $input) {
      id
    }
  }
`;
