import { gql } from "@apollo/client";

export const TransferOwnershipMutation = gql`
  mutation TransferGroupOwnership($input: TransferOwnershipInput!) {
    transferGroupOwnership(input: $input) {
      userId
    }
  }
`;
