// Utilities
import { defineStore } from "pinia";
import { CollectionCache } from "@/types/collection";
import { UserCollectionsQuery } from "@/graphql/query/collections/getUserCollections.graphql";
import { CollectionQuery } from "@/graphql/query/collections/getCollection.graphql";
import {
  Collection,
  CollectionInput,
  Pager,
  UserCollectionsInput
} from "@/gql/graphql";

export interface CollectionsState {
  items: CollectionCache[];
  pager: Pager;
}

export const useCollectionsStore = defineStore("collections", {
  state: () =>
    ({
      items: [],
      pager: {
        totalItems: 0
      }
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
    async getCollections(input: UserCollectionsInput, store = true) {
      const {
        data: { collections }
      } = await this.$apollo.query({
        query: UserCollectionsQuery,
        variables: {
          input
        }
      });
      if (store) {
        this.items = collections.items;
        this.pager = collections.pager;
      }
      return collections;
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
