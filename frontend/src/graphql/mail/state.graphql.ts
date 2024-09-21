import { gql } from "@apollo/client";

const MailStateQuery = gql`
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
