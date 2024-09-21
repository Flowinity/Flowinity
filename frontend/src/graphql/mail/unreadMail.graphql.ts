import { gql } from "@apollo/client";

const UnreadMailQuery = gql`
  query UnreadMail {
    unreadMail
  }
`;
