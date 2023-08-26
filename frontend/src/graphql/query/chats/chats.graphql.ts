import { gql } from "@apollo/client";

export const ChatsQuery = gql`
  query ChatsQuery {
    chats {
      id
      type
      name
      userId
      icon
      createdAt
      updatedAt
      legacyUserId
      user {
        username
        id
        createdAt
        administrator
        moderator
        avatar
      }
      association {
        id
        chatId
        userId
        rank
        lastRead
        notifications
        legacyUserId
        user {
          username
          id
          createdAt
          administrator
          moderator
          avatar
        }
      }
      users {
        id
        chatId
        userId
        rank
        lastRead
        notifications
        legacyUserId
        user {
          username
          id
          createdAt
          administrator
          moderator
          avatar
        }
      }
      _redisSortDate
      recipient {
        username
        id
        createdAt
        administrator
        moderator
        avatar
      }
    }
  }
`;
