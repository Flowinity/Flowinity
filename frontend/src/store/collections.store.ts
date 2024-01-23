// Utilities
import { defineStore } from "pinia";
import { CollectionCache } from "@/types/collection";
import {
  UserCollectionsQuery,
  UserLightCollectionsQuery
} from "@/graphql/collections/getUserCollections.graphql";
import { CollectionQuery } from "@/graphql/collections/getCollection.graphql";
import {
  Collection,
  CollectionInput,
  Pager,
  UserCollectionsInput
} from "@/gql/graphql";
import { useApolloClient } from "@vue/apollo-composable";

export const useCollectionsStore = defineStore("collections", {
  state: () => ({
    items: [] as CollectionCache[],
    pager: {
      totalItems: 0
    } as Pager,
    complete: false,
    page: 1,
    persistent: [] as {
      id: number;
      name: string;
      permissionsMetadata: {
        write: boolean;
        read: boolean;
        configure: boolean;
      };
    }[]
  }),
  getters: {
    write(state) {
      return state.persistent.filter(
        (c) => c.permissionsMetadata.write || c.permissionsMetadata.configure
      );
    }
  },
  actions: {
    async getCollections(
      input: UserCollectionsInput,
      store = true,
      reset = false
    ) {
      if (reset) this.page = 1;
      const {
        data: { collections }
      } = await useApolloClient().client.query({
        query: UserCollectionsQuery,
        variables: {
          input: {
            ...input,
            page: this.page,
            limit: 24
          }
        }
      });
      if (store && !reset) {
        this.items.push(...collections.items);
        this.pager = collections.pager;
      } else if (store && reset) {
        this.items = collections.items;
        this.pager = collections.pager;
      }
      if (!collections.items.length) {
        this.complete = true;
      }
      return collections;
    },
    async getCollection(id: number | string): Promise<Collection | null> {
      const {
        data: { collection }
      } = await useApolloClient().client.query({
        query: CollectionQuery,
        fetchPolicy: "network-only",
        variables: {
          input: {
            id: typeof id === "string" ? undefined : id,
            shareLink: typeof id === "string" ? id : undefined
          }
        } as CollectionInput
      });
      return collection;
    },
    async init() {
      const {
        data: { collections }
      } = await useApolloClient().client.query({
        query: UserLightCollectionsQuery,
        fetchPolicy: "network-only",
        variables: {
          input: {}
        }
      });
      if (collections) {
        this.persistent = collections.items;
      }
    }
  }
});
