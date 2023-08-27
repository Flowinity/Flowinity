import { gql } from "@apollo/client";

export const ExperimentsQuery = gql`
  query GetExperiments {
    experiments {
      id
      value
      description
      createdAt
    }
  }
`;
