import { gql } from "@apollo/client";

export const ToggleUserRankMutation = gql`
  mutation ToggleUserRank($input: AddRank!) {
    toggleUserRank(input: $input) {
      success
    }
  }
`;
