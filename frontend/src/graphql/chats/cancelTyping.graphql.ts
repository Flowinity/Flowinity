import { gql } from "@apollo/client";

const CancelTyping = gql`
  mutation CancelTyping($input: Int!) {
    cancelTyping(input: $input)
  }
`;
