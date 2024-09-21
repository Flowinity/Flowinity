import { gql } from "@apollo/client";

const LeaveCollectionMutation = gql`
  mutation LeaveCollection($input: LeaveCollectionInput!) {
    leaveCollection(input: $input) {
      success
    }
  }
`;
