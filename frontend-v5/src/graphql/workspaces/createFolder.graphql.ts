import { gql } from "@apollo/client";

export const CreateWorkspaceFolderMutation = gql`
  mutation CreateWorkspaceFolder($input: CreateWorkspaceFolderInput!) {
    createWorkspaceFolder(input: $input) {
      id
      name
    }
  }
`;
