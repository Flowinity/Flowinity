import { gql } from "@apollo/client";

export const CreateRankMutation = gql`
  mutation AddChatRank($input: CreateRank!) {
    addChatRank(input: $input) {
      id
    }
  }
`;
