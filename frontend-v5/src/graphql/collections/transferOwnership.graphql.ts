import { gql } from "@apollo/client";

export const TransferCollectionOwnership = gql`
  mutation TransferCollectionOwnership(
    $input: TransferCollectionOwnershipInput!
  ) {
    transferCollectionOwnership(input: $input) {
      success
    }
  }
`;
