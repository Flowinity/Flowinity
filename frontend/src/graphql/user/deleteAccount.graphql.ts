import { gql } from "@apollo/client";

const DeleteAccountMutation = gql`
  mutation DeleteAccount($input: DangerZoneInput!) {
    deleteAccount(input: $input)
  }
`;

const DeleteGalleryMutation = gql`
  mutation DeleteGallery($input: DangerZoneInput!) {
    deleteGallery(input: $input)
  }
`;
