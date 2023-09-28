import { gql } from "@apollo/client";

export const CreateChatMutation = gql`
  mutation CreateChat($input: CreateChatInput!) {
    createChat(input: $input) {
      id
      association {
        id
      }
    }
  }
`;
