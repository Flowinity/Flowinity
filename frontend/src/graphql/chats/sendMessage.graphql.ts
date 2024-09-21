import { gql } from "@apollo/client";

const SendMessageMutation = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
    }
  }
`;
