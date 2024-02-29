import { gql } from "@apollo/client";

export const DeleteAccountMutation = gql`
  mutation DeleteAccount($input: DangerZoneInput!) {
    deleteAccount(input: $input)
  }
`;
