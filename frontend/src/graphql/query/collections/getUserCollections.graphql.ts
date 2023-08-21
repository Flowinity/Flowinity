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
      user {
        username
        id
        avatar
      }
      recipient {
        id
        createdAt
        read
        write
        configure
        accepted
        recipientId
        user {
          username
          id
          createdAt
          administrator
          moderator
          avatar
        }
        collectionId
      }
    }
  }
`;
