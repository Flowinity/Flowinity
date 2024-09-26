import { gql } from "@apollo/client";

const LeaveCollectionMutation = gql`
  mutation OnLeaveCollection($input: LeaveCollectionInput!) {
    leaveCollection(input: $input) {
      success
    }
  }
`;
