import { gql } from "@apollo/client";
import { PagerFragment } from "@/graphql/fragments/pager.graphql";

export const StandardMessageFragment = gql`
  fragment StandardMessage on Message {
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
      user {
        id
        username
        avatar
      }
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
  ${StandardMessageFragment}
  query Messages($input: InfiniteMessagesInput!) {
    messages(input: $input) {
      ...StandardMessage
    }
  }
`;

export const PagedMessagesQuery = gql`
  ${StandardMessageFragment}
  ${PagerFragment}
  query PagedMessages($input: PagedMessagesInput!) {
    messagesPaged(input: $input) {
      items {
        ...StandardMessage
      }
      pager {
        ...Pager
      }
    }
  }
`;
