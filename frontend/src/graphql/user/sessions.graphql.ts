import { gql } from "@apollo/client";

const SessionsQuery = gql`
  query Sessions($input: SessionInput) {
    currentUser {
      sessions(input: $input) {
        id
        type
        createdAt
        updatedAt
        scopes
        token
        info {
          accessedFrom {
            ip
            userAgent
            isp
            location
            date
            asn
          }
        }
        name
      }
    }
  }
`;
