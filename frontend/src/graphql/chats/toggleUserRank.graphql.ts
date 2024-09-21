import { gql } from "@apollo/client";

const ToggleUserRankMutation = gql`
  mutation ToggleUserRank($input: AddRank!) {
    toggleUserRank(input: $input) {
      success
    }
  }
`;
