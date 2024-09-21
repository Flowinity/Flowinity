import { gql } from "@apollo/client";

const CreateRankMutation = gql`
  mutation AddChatRank($input: CreateRank!) {
    addChatRank(input: $input) {
      id
    }
  }
`;
