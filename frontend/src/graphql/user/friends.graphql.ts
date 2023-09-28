import { gql } from "@apollo/client";

export const FriendsQuery = gql`
  query Friends {
    friends {
      id
      status
      userId
      friendId
      user {
        username
        id
        createdAt
        administrator
        moderator
        avatar
        status
      }
    }
  }
`;
