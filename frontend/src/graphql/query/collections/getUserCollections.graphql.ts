import { gql } from "@apollo/client";

export const UserCollectionsQuery = gql`
  query UserCollectionsQuery {
    userCollections {
      id
      name
      image
      userId
      shareLink
      preview {
        attachment {
          attachment
        }
      }
      shared
      permissionsMetadata {
        configure
        read
        write
      }
      users {
        id
        configure
        user {
          username
          id
          createdAt
          administrator
          moderator
          avatar
        }
      }
      itemCount
    }
  }
`;
