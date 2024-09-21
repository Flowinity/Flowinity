import { gql } from "@apollo/client";

const DeleteMessageMutation = gql`
  mutation DeleteMessage($input: DeleteMessageInput!) {
    deleteMessage(input: $input)
  }
`;
