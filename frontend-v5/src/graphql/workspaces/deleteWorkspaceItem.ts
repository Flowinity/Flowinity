import { gql } from "@apollo/client";

export const DeleteWorkspaceItemMutation = gql`
  mutation SaveNote($input: DeleteWorkspaceItemInput!) {
    deleteWorkspaceItem(input: $input)
  }
`;
