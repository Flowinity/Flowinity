import { gql } from "@apollo/client";

export const UpdateShareLinkMutation = gql`
  mutation ToggleNoteShare($input: Int!) {
    toggleNoteShare(input: $input) {
      shareLink
    }
  }
`;
