import { gql } from "@apollo/client";

const AddChatUserMutation = gql`
  mutation AddChatUsers($input: AddChatUser!) {
    addChatUsers(input: $input) {
      success
    }
  }
`;
