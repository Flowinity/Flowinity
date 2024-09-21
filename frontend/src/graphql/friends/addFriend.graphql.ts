import { gql } from "@apollo/client";

const AddFriendMutation = gql`
  mutation AddFriend($input: AddFriendInput!) {
    friend(input: $input)
  }
`;
