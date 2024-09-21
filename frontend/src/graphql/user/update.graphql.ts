import { gql } from "@apollo/client";

const UpdateUserMutation = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input)
  }
`;

const UpdateUserStatusMutation = gql`
  mutation UpdateStatus($input: UpdateUserStatusInput!) {
    updateStatus(input: $input)
  }
`;
