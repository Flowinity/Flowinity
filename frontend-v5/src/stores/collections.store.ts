import { ref, computed, markRaw, type Raw } from "vue";
import { defineStore, getActivePinia } from "pinia";
import type { Collection, CollectionInput, Pager } from "@/gql/graphql";
import { CollectionQuery } from "@/graphql/collections/getCollection.graphql";
import { isNumeric } from "@/plugins/isNumeric";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  AddToCollectionMutation,
  RemoveFromCollectionMutation
} from "@/graphql/collections/addToCollection.graphql";
import { useRoute } from "vue-router";

export const useCollectionsStore = defineStore("collections", () => {
  const items = ref<Collection[]>([]);
  const pager = ref<Pager | null>(null);

  async function getCollection(id: string | number) {
    const {
      data: { collection }
    } = await getActivePinia()!!._a.config.globalProperties.$apollo.query({
      query: CollectionQuery,
      variables: {
        input: {
          id: isNumeric(id) ? id : undefined,
          shareLink: !isNumeric(id) ? id : undefined
        }
      } as CollectionInput
    });
    return collection;
  }

  async function addToCollection(collectionId: number, items: number[]) {
    const data = useMutation(AddToCollectionMutation, {
      variables: {
        input: {
          collectionId,
          items
        }
      }
    });
    await data.mutate();
  }

  async function removeFromCollection(collectionId: number, items: number[]) {
    const data = useMutation(RemoveFromCollectionMutation, {
      variables: {
        input: {
          collectionId,
          items
        }
      }
    });
    await data.mutate();
  }

  const route = useRoute();
  const selected = computed(() => {
    if (!route.path.startsWith("/collections/")) return;
    return items.value.find(
      (collection) => collection.id === parseInt(<string>route.params.id)
    );
  });

  return {
    items,
    pager,
    getCollection,
    addToCollection,
    removeFromCollection,
    selected
  };
});
