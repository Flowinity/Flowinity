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
      description
      type
      background
      unread
      name
      userId
      icon
      createdAt
      updatedAt
      invites {
        id
        userId
        createdAt
        rankId
        updatedAt
        expiredAt
        invalidated
      }
      association {
        id
        hidden
        chatId
        permissions
        userId
        rank
        createdAt
        lastRead
        notifications
      }
      users {
        id
        chatId
        userId
        rank
        createdAt
        lastRead
        ranksMap
      }
      _redisSortDate
      recipient {
        id
      }
      ranks {
        id
        color
        name
        userId
        createdAt
        chatId
        updatedAt
        managed
        index
        permissionsMap
      }
    }
  }
`;
