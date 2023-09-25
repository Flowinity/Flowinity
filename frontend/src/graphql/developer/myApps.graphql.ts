import { gql } from "@apollo/client";

export const MyAppsQuery = gql`
  query DevApps {
    devApps {
      id
      name
      icon
      shortCode
      verified
      redirectUri
      secret
      description
      scopes
      userId
      private
      user {
        username
      }
    }
  }
`;
