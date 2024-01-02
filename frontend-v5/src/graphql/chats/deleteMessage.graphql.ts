import { gql } from "@apollo/client";

export const DeleteMessageMutation = gql`
  mutation DeleteMessage($input: DeleteMessageInput!) {
    deleteMessage(input: $input)
  }
`;
