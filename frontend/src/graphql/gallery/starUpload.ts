import { gql } from "@apollo/client";

const StarUploadMutation = gql`
  mutation StarUpload($input: StarUploadInput!) {
    starUpload(input: $input) {
      status
    }
  }
`;
