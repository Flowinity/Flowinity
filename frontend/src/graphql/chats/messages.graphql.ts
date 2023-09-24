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
      data
    }
    reply {
      readReceipts {
        id
        userId
        lastRead
        legacyUserId
      }
      content
      userId
      id
      legacyUserId
      embeds {
        type
      }
      legacyUser {
        username
        id
        avatar
      }
      user {
        username
        id
        avatar
      }
    }
    legacyUser {
      username
      id
      avatar
    }
    user {
      username
      id
      avatar
    }
    edited
    editedAt
    replyId
    legacyUserId
    pinned
    readReceipts {
      id
      userId
      lastRead
      legacyUserId
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
