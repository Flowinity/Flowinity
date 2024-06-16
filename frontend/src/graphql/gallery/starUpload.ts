import { gql } from "@apollo/client";

export const StarUploadMutation = gql`
  mutation StarUpload($input: StarUploadInput!) {
    starUpload(input: $input) {
      status
    }
  }
`;
