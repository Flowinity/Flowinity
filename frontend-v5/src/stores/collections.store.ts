import { ref, computed, markRaw, type Raw } from "vue";
import { defineStore } from "pinia";
import type { Collection, Pager } from "@/gql/graphql";

export const useCollectionsStore = defineStore("collections", () => {
  const items = ref<Collection[]>([]);
  const pager = ref<Pager | null>(null);

  return {
    items,
    pager
  };
});
