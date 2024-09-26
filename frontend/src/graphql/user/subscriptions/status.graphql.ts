import { gql } from "@apollo/client";

const UserStatusSubscription = gql`
  subscription OnUserStatus {
    onUserStatus {
      id
      status
      platforms {
        platform
        id
        lastSeen
        status
      }
    }
  }
`;
