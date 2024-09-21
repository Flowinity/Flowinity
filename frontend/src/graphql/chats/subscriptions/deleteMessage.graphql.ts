import { gql } from "@apollo/client";

const DeleteMessageSubscription = gql`
  subscription OnDeleteMessage {
    onDeleteMessage {
      id
      associationId
    }
  }
`;
