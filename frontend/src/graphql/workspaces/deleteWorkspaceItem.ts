import { gql } from "@apollo/client";

const DeleteWorkspaceItemMutation = gql`
  mutation SaveNote($input: DeleteWorkspaceItemInput!) {
    deleteWorkspaceItem(input: $input)
  }
`;
