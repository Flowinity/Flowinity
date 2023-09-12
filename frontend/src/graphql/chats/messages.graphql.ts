import { gql } from "@apollo/client";
import { PagerFragment } from "@/graphql/fragments/pager.graphql";

export const StandardMessageFragment = `
  {
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
      user {
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

export const MessagesQuery = gql`
  query Messages($input: InfiniteMessagesInput!) {
    messages(input: $input) ${StandardMessageFragment}
  }
`;

export const PagedMessagesQuery = gql`
  query PagedMessages($input: PagedMessagesInput!) {
    messagesPaged(input: $input) {
        items ${StandardMessageFragment}
        pager ${PagerFragment}
    }
  }
`;
