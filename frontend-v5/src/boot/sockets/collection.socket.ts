import { useSubscription } from "@vue/apollo-composable";
import {
  CollectionCreatedSubscription,
  CollectionRemovedSubscription,
  CollectionUpdatedSubscription
} from "@/graphql/collections/subscriptions/updateCollection.graphql";
import { useRoute, useRouter } from "vue-router";
import { useCollectionsStore } from "@/stores/collections.store";
import { gql } from "@apollo/client";
import { useFrameworkStore } from "@/stores/framework.store";

export default function setup() {
  const collectionsStore = useCollectionsStore();
  const frameworkStore = useFrameworkStore();

  useSubscription(CollectionRemovedSubscription).onResult(({ data }) => {
    collectionsStore.items = collectionsStore.items.filter(
      (c) => c.id !== data.collectionRemoved
    );

    console.log(collectionsStore.selected?.id, data.collectionRemoved);

    if (collectionsStore.selected?.id === data.collectionRemoved) {
      frameworkStore.push("/gallery");
    }
  });

  useSubscription(CollectionCreatedSubscription).onResult(({ data }) => {
    collectionsStore.items = [
      {
        ...data.collectionCreated,
        new: true
      },
      ...collectionsStore.items
    ];
  });

  useSubscription(CollectionUpdatedSubscription).onResult(({ data }) => {
    const index = collectionsStore.items.findIndex(
      (c) => c.id === data.collectionUpdated.id
    );
    if (index === -1) return;
    const collection = {
      ...collectionsStore.items[index],
      ...data.collectionUpdated
    };
    collectionsStore.items = [
      ...collectionsStore.items.slice(0, index),
      collection,
      ...collectionsStore.items.slice(index + 1)
    ];
  });

  useSubscription(gql`
    subscription CollectionInviteCountSubscription {
      collectionInviteCount
    }
  `).onResult(({ data }) => {
    collectionsStore.invites = data.collectionInviteCount;
  });
}
