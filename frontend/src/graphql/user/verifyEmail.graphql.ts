import { gql } from "@apollo/client";

const VerifyEmailMutation = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token)
  }
`;

const SendEmailVerificationMutation = gql`
  mutation SendVerificationEmail {
    resendVerificationEmail
  }
`;
