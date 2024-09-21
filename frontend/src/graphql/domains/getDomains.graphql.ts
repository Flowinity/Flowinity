import { gql } from "@apollo/client";

const DomainQuery = gql`
  query Domains {
    domains {
      domain
      id
      userId
      user {
        username
        id
        avatar
      }
    }
  }
`;
