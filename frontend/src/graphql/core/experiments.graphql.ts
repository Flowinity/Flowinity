import { gql } from "@apollo/client";

const ExperimentsQuery = gql`
  query GetExperiments($version: Int) {
    experiments(version: $version) {
      id
      value
      description
      createdAt
      versions
    }
  }
`;

const SetExperimentMutation = gql`
  mutation SetExperiment($input: SetExperimentInput!) {
    setExperiment(input: $input) {
      value
      key
    }
  }
`;
