import { gql } from "@apollo/client";

export const CollectionUpdatedSubscription = gql`
  subscription CollectionUpdated($input: FilterCollectionInput) {
    collectionUpdated(input: $input) {
      id
      name
      banner
      avatar
      shareLink
      userId
      itemCount
    }
  }
`;

export const CollectionUserAddSubscription = gql`
  subscription CollectionUserAdded($input: FilterCollectionInput) {
    collectionUserAdded(input: $input) {
      id
    }
  }
`;

export const CollectionUserRemoveSubscription = gql`
  subscription CollectionUserRemoved($input: FilterCollectionInput) {
    collectionUserRemoved(input: $input) {
      id
    }
  }
`;

export const CollectionUserUpdateSubscription = gql`
  subscription CollectionUserUpdated($input: FilterCollectionInput) {
    collectionUserUpdated(input: $input) {
      id
    }
  }
`;

export const CollectionCreatedSubscription = gql`
  subscription CollectionCreated {
    collectionCreated {
      id
      name
      banner
      avatar
      shareLink
      userId
      itemCount
    }
  }
`;

export const CollectionRemovedSubscription = gql`
  subscription CollectionRemoved($input: FilterCollectionInput) {
    collectionRemoved(input: $input)
  }
`;
