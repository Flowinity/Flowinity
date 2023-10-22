import { gql } from "@apollo/client";

export const CreateCollectionMutation = gql`
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      id
    }
  }
`;
