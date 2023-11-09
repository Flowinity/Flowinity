import { gql } from "@apollo/client";

export const VerifyEmailMutation = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token)
  }
`;

export const SendEmailVerificationMutation = gql`
  mutation SendVerificationEmail {
    resendVerificationEmail
  }
`;
