import { gql } from "@apollo/client";

export const ExperimentsQuery = gql`
  query GetExperiments {
    getExperiments {
      id
      value
      description
      createdAt
    }
  }
`;
