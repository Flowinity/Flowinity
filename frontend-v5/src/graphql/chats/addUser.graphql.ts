import { gql } from "@apollo/client";

export const AddChatUserMutation = gql`
  mutation AddChatUsers($input: AddChatUser!) {
    addChatUsers(input: $input) {
      success
    }
  }
`;
