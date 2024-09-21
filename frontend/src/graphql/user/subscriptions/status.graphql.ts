import { gql } from "@apollo/client";

const UserStatusSubscription = gql`
  subscription UserStatus {
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
