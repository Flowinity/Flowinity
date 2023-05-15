// Utilities
import {defineStore} from "pinia"
import axios from "@/plugins/axios"
import {CollectionCache} from "@/types/collection"

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
      )
    }
  },
  actions: {
    async init() {
      const {data} = await axios.get("/collections")
      this.items = data
    }
  }
})
