import { gql } from "@apollo/client";

export const UserStatusSubscription = gql`
  subscription UserStatus {
    userStatus {
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
