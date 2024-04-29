import { gql } from "@apollo/client";

export const UnreadMailQuery = gql`
  query UnreadMail {
    unreadMail
  }
`;
