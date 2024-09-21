import { gql } from "@apollo/client";

const EditMessageMutation = gql`
  mutation EditMessage($input: EditMessageInput!) {
    editMessage(input: $input) {
      id
    }
  }
`;
