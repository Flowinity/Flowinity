import { gql } from "@apollo/client";

export const UploadsSubscription = gql`
  subscription CreateUploads {
    createUpload {
      upload {
        id
        createdAt
        updatedAt
        attachment
        userId
        name
        originalFilename
        type
        fileSize
        deletable
        textMetadata
        user {
          username
          id
        }
        item {
          id
        }
        collections {
          name
          id
        }
        starred {
          id
        }
      }
    }
  }
`;
