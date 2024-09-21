import { gql } from "@apollo/client";

const DeleteChatRankMutation = gql`
  mutation DeleteChatRank($input: DeleteRank!) {
    deleteChatRank(input: $input) {
      success
    }
  }
`;
