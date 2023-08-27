import { gql } from "@apollo/client";

export const MessagesQuery = gql`
  query Messages($input: MessagesInput!) {
    messages(input: $input) {
      id
      createdAt
      updatedAt
      chatId
      userId
      content
      type
      embeds {
        type
        data {
          url
          title
          description
          siteName
          width
          height
          upload {
            id
          }
          type
        }
      }
      edited
      editedAt
      replyId
      legacyUserId
      pinned
      tpuUser {
        username
        id
        createdAt
        administrator
        moderator
        avatar
      }
      reply {
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
      }
      legacyUser {
        username
        id
        createdAt
        administrator
        moderator
        avatar
      }
      user {
        username
        id
        createdAt
        administrator
        moderator
        avatar
      }
      readReceipts {
        id
        chatId
        userId
        rank
        lastRead
        notifications
        legacyUserId
      }
    }
  }
`;
