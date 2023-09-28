import { gql } from "@apollo/client";

export const SaveNoteMutation = gql`
  mutation SaveNote($input: SaveNoteInput!) {
    saveNote(input: $input) {
      id
      name
      workspaceFolderId
    }
  }
`;
