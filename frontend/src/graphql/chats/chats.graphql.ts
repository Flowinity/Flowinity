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
      legacyUserId
      _redisSortDate
      usersCount
      recipient {
        id
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
        legacyUserId
      }
    }
  }
`;

export const ChatQuery = gql`
  query Chat($input: ChatInput!) {
    chat(input: $input) {
      id
      users {
        id
        chatId
        userId
        rank
        createdAt
        lastRead
        legacyUserId
        ranksMap
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
      invites {
        id
        userId
        createdAt
        rankId
        updatedAt
        expiredAt
        invalidated
      }
    }
  }
`;

export const _OldChatsQuery = gql`
  query ChatsQueryOld {
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
      legacyUserId
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
        legacyUserId
      }
      users {
        id
        chatId
        userId
        rank
        createdAt
        lastRead
        legacyUserId
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

export const GetChatUsersQuery = gql`
  query GetChatUsers($input: ChatInput!) {
    chat(input: $input) {
      users {
        id
        chatId
        userId
        user {
          id
          username
          avatar
        }
      }
    }
  }
`;
