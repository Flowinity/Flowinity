import { gql } from "@apollo/client";

export const PermissionsQuery = gql`
  query AvailableChatPermissions {
    availableChatPermissions {
      id
      description
      name
      createdAt
      updatedAt
      group
    }
  }
`;
