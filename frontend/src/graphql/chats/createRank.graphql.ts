import { gql } from "@apollo/client";

const CreateRankMutation = gql`
  mutation CreateChatRank($input: CreateRank!) {
    addChatRank(input: $input) {
      id
    }
  }
`;
