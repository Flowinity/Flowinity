import { gql } from "@apollo/client";

const TypingSubscription = gql`
  subscription TypingEvent {
    onTyping {
      chatId
      expires
      user {
        id
      }
    }
  }
`;

const CancelTypingSubscription = gql`
  subscription CancelTypingEvent {
    onCancelTyping {
      chatId
      expires
      user {
        id
      }
    }
  }
`;
