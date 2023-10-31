import { gql } from "@apollo/client";

export const DomainQuery = gql`
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
