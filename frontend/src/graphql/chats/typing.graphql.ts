import { gql } from "@apollo/client";

const CancelTyping = gql`
  mutation Typing($input: Int!) {
    typing(input: $input)
  }
`;
