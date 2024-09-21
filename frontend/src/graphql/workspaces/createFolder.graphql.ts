import { gql } from "@apollo/client";

const CreateWorkspaceFolderMutation = gql`
  mutation CreateWorkspaceFolder($input: CreateWorkspaceFolderInput!) {
    createWorkspaceFolder(input: $input) {
      id
      name
    }
  }
`;
