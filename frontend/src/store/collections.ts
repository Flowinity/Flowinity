// Utilities
import { defineStore } from "pinia";
import { CollectionCache } from "@/types/collection";
import { UserCollectionsQuery } from "@/graphql/query/collections/getUserCollections.gql";

export interface CollectionsState {
  items: CollectionCache[];
}

export const useCollectionsStore = defineStore("collections", {
  state: () =>
    ({
      items: []
    } as CollectionsState),
  getters: {
    write(state) {
      return state.items.filter(
        (c: CollectionCache) =>
          c.permissionsMetadata.write || c.permissionsMetadata.configure
      );
    }
  },
  actions: {
    async init() {
      const {
        data: { userCollections }
      } = await this.$apollo.query({
        query: UserCollectionsQuery
      });
      this.items = userCollections;
    }
  }
});
