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
      (c) => c.id !== data.onCollectionRemoved
    );

    console.log(collectionsStore.selected?.id, data.onCollectionRemoved);

    if (collectionsStore.selected?.id === data.onCollectionRemoved) {
      frameworkStore.push("/gallery");
    }
  });

  useSubscription(CollectionCreatedSubscription).onResult(({ data }) => {
    collectionsStore.items = [
      {
        ...data.onCollectionCreated,
        new: true
      },
      ...collectionsStore.items
    ];
  });

  useSubscription(CollectionUpdatedSubscription).onResult(({ data }) => {
    const index = collectionsStore.items.findIndex(
      (c) => c.id === data.onCollectionUpdated.id
    );
    if (index === -1) return;
    const collection = {
      ...collectionsStore.items[index],
      ...data.onCollectionUpdated
    };
    collectionsStore.items = [
      ...collectionsStore.items.slice(0, index),
      collection,
      ...collectionsStore.items.slice(index + 1)
    ];
  });

  useSubscription(gql`
    subscription CollectionInviteCountSubscription {
      onCollectionInviteCount
    }
  `).onResult(({ data }) => {
    collectionsStore.invites = data.onCollectionInviteCount;
  });
}
