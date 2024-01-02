import { gql } from "@apollo/client";

export const AddToCollectionMutation = gql`
  mutation AddToCollection($input: AddToCollectionInput!) {
    addToCollection(input: $input) {
      id
    }
  }
`;

export const RemoveFromCollectionMutation = gql`
  mutation RemoveFromCollection($input: AddToCollectionInput!) {
    removeFromCollection(input: $input)
  }
`;

export const ActOnCollectionInviteMutation = gql`
  mutation ActOnCollectionInvite($input: AcceptCollectionInviteInput!) {
    actOnCollectionInvite(input: $input) {
      success
    }
  }
`;
