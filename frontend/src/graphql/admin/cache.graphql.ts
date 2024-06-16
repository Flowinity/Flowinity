import { gql } from "@apollo/client";

export const ClearCacheMutation = gql`
  mutation AdminClearCache($input: ClearCacheInput!) {
    adminClearCache(input: $input) {
      success
    }
  }
`;
