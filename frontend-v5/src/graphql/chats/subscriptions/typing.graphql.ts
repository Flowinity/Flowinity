import { gql } from "@apollo/client";

export const TypingSubscription = gql`
  subscription TypingEvent {
    typingEvent {
      chatId
      expires
      user {
        id
      }
    }
  }
`;

export const CancelTypingSubscription = gql`
  subscription CancelTypingEvent {
    cancelTypingEvent {
      chatId
      expires
      user {
        id
      }
    }
  }
`;
