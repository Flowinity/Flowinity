import { gql } from "@apollo/client";

export const ActAutoCollectsMutation = gql`
  mutation ActOnAutoCollects($input: ActOnAutoCollectsInput!) {
    actOnAutoCollects(input: $input) {
      success
    }
  }
`;
