import { gql } from "@apollo/client";

export const CreateOauthAppMutation = gql`
  mutation CreateOauthApp($input: CreateAppInput!) {
    createOauthApp(input: $input) {
      id
    }
  }
`;

export const CreateBotAccountMutation = gql`
  mutation CreateBotOauthApp($input: CreateBotInput!) {
    createBotOauthApp(input: $input) {
      id
    }
  }
`;
