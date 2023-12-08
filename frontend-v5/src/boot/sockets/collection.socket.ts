import { useSubscription } from "@vue/apollo-composable";
import {
  CollectionCreatedSubscription,
  CollectionRemovedSubscription,
  CollectionUpdatedSubscription
} from "@/graphql/collections/subscriptions/updateCollection.graphql";
import { useRoute, useRouter } from "vue-router";
import { useCollectionsStore } from "@/stores/collections.store";

export default function setup() {
  const collectionsStore = useCollectionsStore();
  const router = useRouter();
  const route = useRoute();

  useSubscription(CollectionRemovedSubscription).onResult(({ data }) => {
    collectionsStore.items = collectionsStore.items.filter(
      (c) => c.id !== data.collectionRemoved
    );

    if (
      route.name === "Collection" &&
      route.params.collectionId === data.collectionRemoved
    ) {
      router.push({ name: "Gallery" });
    }
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
