import { gql } from "@apollo/client";

const TransferOwnershipMutation = gql`
  mutation TransferGroupOwnership($input: TransferOwnershipInput!) {
    transferGroupOwnership(input: $input) {
      userId
    }
  }
`;
