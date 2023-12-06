import { useSubscription } from "@vue/apollo-composable";
import {
  CollectionCreatedSubscription,
  CollectionRemovedSubscription,
  CollectionUpdatedSubscription
} from "@/graphql/collections/subscriptions/updateCollection.graphql";
import { useRouter } from "vue-router";
import { useCollectionsStore } from "@/stores/collections.store";

export default function setup() {
  const collectionsStore = useCollectionsStore();

  useSubscription(CollectionRemovedSubscription).onResult(({ data }) => {
    collectionsStore.items = collectionsStore.items.filter(
      (c) => c.id !== data.collectionRemoved
    );
  });

  useSubscription(CollectionCreatedSubscription).onResult(({ data }) => {
    collectionsStore.items = [
      ...collectionsStore.items,
      data.collectionCreated
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
}
