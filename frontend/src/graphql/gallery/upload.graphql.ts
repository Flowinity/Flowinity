import { gql } from "@apollo/client";

export const UploadGalleryMutation = gql`
  mutation Upload($file: File!) {
    upload(file: $file) {
      id
      attachment
    }
  }
`;
