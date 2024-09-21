import { gql } from "@apollo/client";

const ReadChatSubscription = gql`
  subscription OnReadChat {
    onReadChat
  }
`;
