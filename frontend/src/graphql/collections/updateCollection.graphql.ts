import { gql } from "@apollo/client";

export const UpdateCollectionMutation = gql`
  mutation UpdateCollection($input: UpdateCollectionInput!) {
    updateCollection(input: $input) {
      shareLink
      name
      id
    }
  }
`;
