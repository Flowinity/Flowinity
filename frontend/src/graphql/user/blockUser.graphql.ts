import { gql } from "@apollo/client";

const BlockUserMutation = gql`
  mutation BlockUser($input: BlockUserInput!) {
    blockUser(input: $input) {
      success
    }
  }
`;
