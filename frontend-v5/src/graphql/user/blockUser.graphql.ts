import { gql } from "@apollo/client";

export const BlockUserMutation = gql`
  mutation BlockUser($input: BlockUserInput!) {
    blockUser(input: $input) {
      success
    }
  }
`;
