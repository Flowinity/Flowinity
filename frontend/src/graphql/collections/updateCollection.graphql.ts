import { gql } from "@apollo/client";

const UpdateCollectionMutation = gql`
  mutation UpdateCollection($input: UpdateCollectionInput!) {
    updateCollection(input: $input) {
      shareLink
      name
      id
    }
  }
`;
