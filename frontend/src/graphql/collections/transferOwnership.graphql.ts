import { gql } from "@apollo/client";

const TransferCollectionOwnership = gql`
  mutation TransferCollectionOwnership(
    $input: TransferCollectionOwnershipInput!
  ) {
    transferCollectionOwnership(input: $input) {
      success
    }
  }
`;
