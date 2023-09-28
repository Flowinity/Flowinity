import { gql } from "@apollo/client";

export const DeleteChatRankMutation = gql`
  mutation DeleteChatRank($input: DeleteRank!) {
    deleteChatRank(input: $input) {
      success
    }
  }
`;
