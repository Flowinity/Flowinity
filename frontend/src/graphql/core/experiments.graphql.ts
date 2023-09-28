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

export const SetExperimentMutation = gql`
  mutation SetExperiment($input: SetExperimentInput!) {
    setExperiment(input: $input) {
      value
      key
    }
  }
`;
