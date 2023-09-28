import { gql } from "@apollo/client";

export const UpdateRankMutation = gql`
  mutation UpdateChatRank($input: UpdateRank!) {
    updateChatRank(input: $input) {
      id
    }
  }
`;

export const UpdateRankOrderMutation = gql`
  mutation UpdateChatRankOrder($input: UpdateRankOrder!) {
    updateChatRankOrder(input: $input) {
      id
    }
  }
`;
