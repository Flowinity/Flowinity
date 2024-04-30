import { gql } from "@apollo/client";

export const AddFriendMutation = gql`
  mutation AddFriend($input: AddFriendInput!) {
    friend(input: $input)
  }
`;
