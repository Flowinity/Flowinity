import { gql } from "@apollo/client";

export const NewMessageSubscription = gql`
  subscription NewMessage {
    onMessage {
      mention
      message {
        id
        createdAt
        updatedAt
        chatId
        userId
        content
        type
        edited
        editedAt
        replyId
        legacyUserId
        pinned
        pending
        error
        reply {
          id
          createdAt
          updatedAt
          userId
          content
          pending
          error
          user {
            username
            id
            createdAt
            administrator
            moderator
            avatar
            bot
          }
          legacyUser {
            username
            id
            createdAt
            administrator
            moderator
            avatar
            bot
          }
          tpuUser {
            username
            id
            createdAt
            administrator
            moderator
            avatar
            bot
          }
        }
        tpuUser {
          username
          id
          createdAt
          administrator
          moderator
          avatar
          bot
        }
        legacyUser {
          username
          id
          createdAt
          administrator
          moderator
          avatar
          bot
        }
        user {
          username
          id
          createdAt
          administrator
          moderator
          avatar
          bot
        }
        readReceipts {
          associationId
          user {
            id
            avatar
            username
            legacy
          }
          messageId
        }
      }
      associationId
      chat {
        id
        recipient {
          id
          username
        }
        type
      }
    }
  }
`;
