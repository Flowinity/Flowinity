import { gql } from "@apollo/client";

export const ReadChatSubscription = gql`
  subscription OnReadChat {
    onReadChat
  }
`;
