import { gql } from "@apollo/client";

export const WorkspacesQuery = gql`
  query Workspaces {
    workspaces {
      id
      name
      userId
      createdAt
      updatedAt
      icon
      folders {
        id
        createdAt
        updatedAt
        name
        workspaceId
        folderId
        children {
          id
          createdAt
          updatedAt
          name
          workspaceFolderId
          shareLink
        }
      }
    }
  }
`;
