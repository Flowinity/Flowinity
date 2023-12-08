import { gql } from "@apollo/client";

export const LeaveCollectionMutation = gql`
  mutation LeaveCollection($input: LeaveCollectionInput!) {
    leaveCollection(input: $input) {
      success
    }
  }
`;
