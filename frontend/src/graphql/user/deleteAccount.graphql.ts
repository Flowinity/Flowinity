import { gql } from "@apollo/client";

export const DeleteAccountMutation = gql`
  mutation DeleteAccount($input: DangerZoneInput!) {
    deleteAccount(input: $input)
  }
`;

export const DeleteGalleryMutation = gql`
  mutation DeleteGallery($input: DangerZoneInput!) {
    deleteGallery(input: $input)
  }
`;
