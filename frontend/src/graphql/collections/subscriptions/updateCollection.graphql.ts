import { gql } from "@apollo/client";

const CollectionUpdatedSubscription = gql`
  subscription CollectionUpdated($input: FilterCollectionInput) {
    onCollectionUpdated(input: $input) {
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

const CollectionUserAddSubscription = gql`
  subscription CollectionUserAdded($input: FilterCollectionInput) {
    onCollectionUserAdded(input: $input) {
      id
    }
  }
`;

const CollectionUserRemoveSubscription = gql`
  subscription CollectionUserRemoved($input: FilterCollectionInput) {
    onCollectionUserRemoved(input: $input) {
      id
    }
  }
`;

const CollectionUserUpdateSubscription = gql`
  subscription CollectionUserUpdated($input: FilterCollectionInput) {
    onCollectionUserUpdated(input: $input) {
      id
    }
  }
`;

const CollectionCreatedSubscription = gql`
  subscription CollectionCreated {
    onCollectionCreated {
      id
      name
      banner
      avatar
      shareLink
      userId
      itemCount
      new
      permissionsMetadata {
        read
        write
        configure
      }
    }
  }
`;

const CollectionRemovedSubscription = gql`
  subscription CollectionRemoved($input: FilterCollectionInput) {
    onCollectionRemoved(input: $input)
  }
`;
