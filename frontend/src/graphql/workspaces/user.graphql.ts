import { gql } from "@apollo/client";

const AddWorkspaceUserMutation = gql`
  mutation AddWorkspaceUser($input: WorkspaceUserInput!) {
    addWorkspaceUser(input: $input) {
      id
    }
  }
`;
