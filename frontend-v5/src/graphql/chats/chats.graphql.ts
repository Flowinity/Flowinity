import { gql } from "@apollo/client";

export const ChatsQuery = gql`
  query ChatsQuery {
    userEmoji {
      id
      userId
      chatId
      icon
      name
      createdAt
      updatedAt
    }
    chats {
      id
      background
      description
      type
      name
      unread
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
