// Utilities
import { defineStore } from "pinia";
import { CollectionCache } from "@/types/collection";
import { UserCollectionsQuery } from "@/graphql/query/collections/getUserCollections.graphql";
import { CollectionQuery } from "@/graphql/query/collections/getCollection.graphql";
import { Collection, CollectionInput } from "@/gql/graphql";

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
    },
    async getCollection(id: number | string): Promise<Collection | null> {
      const {
        data: { collection }
      } = await this.$apollo.query({
        query: CollectionQuery,
        variables: {
          input: {
            id: typeof id === "string" ? undefined : id,
            shareLink: typeof id === "string" ? id : undefined
          }
        } as CollectionInput
      });
      return collection;
    }
  }
});
