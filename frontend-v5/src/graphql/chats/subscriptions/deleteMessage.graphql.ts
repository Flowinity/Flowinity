import { gql } from "@apollo/client";

export const DeleteMessageSubscription = gql`
  subscription OnDeleteMessage {
    onDeleteMessage {
      id
      associationId
    }
  }
`;
