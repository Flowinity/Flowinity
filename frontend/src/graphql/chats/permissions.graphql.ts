import { gql } from "@apollo/client";

const PermissionsQuery = gql`
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
