import { gql } from "@apollo/client";

const UpdateShareLinkMutation = gql`
  mutation ToggleNoteShare($input: Int!) {
    toggleNoteShare(input: $input) {
      shareLink
    }
  }
`;
