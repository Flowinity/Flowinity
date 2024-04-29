import { gql } from "@apollo/client";

export const AddWorkspaceUserMutation = gql`
  mutation AddWorkspaceUser($input: WorkspaceUserInput!) {
    addWorkspaceUser(input: $input) {
      id
    }
  }
`;
