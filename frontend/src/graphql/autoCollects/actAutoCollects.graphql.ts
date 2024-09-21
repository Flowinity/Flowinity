import { gql } from "@apollo/client";

const ActAutoCollectsMutation = gql`
  mutation ActOnAutoCollects($input: ActOnAutoCollectsInput!) {
    actOnAutoCollects(input: $input) {
      success
    }
  }
`;
