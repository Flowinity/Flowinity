import { gql } from "@apollo/client";

export const DeleteGroupMutation = gql`
  mutation DeleteGroup($input: DangerZoneChatInput!) {
    deleteGroup(input: $input) {
      success
    }
  }
`;
