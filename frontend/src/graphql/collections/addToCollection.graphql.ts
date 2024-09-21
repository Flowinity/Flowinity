import { gql } from "@apollo/client";

const AddToCollectionMutation = gql`
  mutation AddToCollection($input: AddToCollectionInput!) {
    addToCollection(input: $input) {
      id
    }
  }
`;

const RemoveFromCollectionMutation = gql`
  mutation RemoveFromCollection($input: AddToCollectionInput!) {
    removeFromCollection(input: $input)
  }
`;
