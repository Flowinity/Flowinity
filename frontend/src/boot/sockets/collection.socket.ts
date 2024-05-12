import { useSubscription } from "@vue/apollo-composable";
import {
  CollectionCreatedSubscription,
  CollectionRemovedSubscription,
  CollectionUpdatedSubscription
} from "@/graphql/collections/subscriptions/updateCollection.graphql";
import { useRoute, useRouter } from "vue-router";
import { useCollectionsStore } from "@/store/collections.store";
import { gql } from "@apollo/client";
import { App } from "vue";

export default function setup(app: App) {
  const collectionsStore = useCollectionsStore();

  useSubscription(CollectionRemovedSubscription).onResult(({ data }) => {
    if (collectionsStore.selected?.id === data.onCollectionRemoved) {
      app.config.globalProperties.$router.push("/gallery");
    }
    collectionsStore.persistent = collectionsStore.persistent.filter(
      (c) => c.id !== data.onCollectionRemoved
    );
  });

  useSubscription(CollectionCreatedSubscription).onResult(({ data }) => {
    collectionsStore.persistent = [
      {
        ...data.onCollectionCreated,
        new: true
      },
      ...collectionsStore.persistent
    ];
  });

  useSubscription(CollectionUpdatedSubscription).onResult(({ data }) => {
    const index = collectionsStore.persistent.findIndex(
      (c) => c.id === data.onCollectionUpdated.id
    );
    if (index === -1) return;
    const collection = {
      ...collectionsStore.items[index],
      ...data.onCollectionUpdated
    };
    collectionsStore.persistent = [
      ...collectionsStore.persistent.slice(0, index),
      collection,
      ...collectionsStore.persistent.slice(index + 1)
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
