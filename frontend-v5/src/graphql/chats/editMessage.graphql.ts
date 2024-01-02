import { gql } from "@apollo/client";

export const EditMessageMutation = gql`
  mutation EditMessage($input: EditMessageInput!) {
    editMessage(input: $input) {
      id
    }
  }
`;
