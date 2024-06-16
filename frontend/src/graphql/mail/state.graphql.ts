import { gql } from "@apollo/client";

export const MailStateQuery = gql`
  query MailStateQuery {
    unreadMail
    mailboxes {
      path
      name
      delimiter
      flags
      specialUse
      listed
      subscribed
    }
  }
`;
