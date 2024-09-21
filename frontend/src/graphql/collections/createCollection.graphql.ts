import { gql } from "@apollo/client";

const CreateCollectionMutation = gql`
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      id
    }
  }
`;
