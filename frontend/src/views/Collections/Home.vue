<template>
  <v-container>
    <CreateCollectionDialog v-model="create" />
    <GalleryNavigation
      v-model:search="search"
      :supports="{ filter: true, metadata: false, search: true }"
      @refresh-gallery="getCollections(undefined, true)"
      @update:filter="filter = $event"
    />
    <v-btn class="mt-1 ml-1" style="float: right" @click="create = true">
      {{ $t("collections.create") }}
    </v-btn>
    <br />
    <br />
    <br />
    <v-row class="mb-1">
      <v-col
        v-for="item in $collections.items"
        :key="'item-' + item.id + '-' + (item.shared ? 'shared' : 'owned')"
        md="4"
        xl="3"
        cols="12"
      >
        <CollectionCard :item="item" />
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <v-col v-for="item in 12" :key="item" md="4" xl="3" cols="12">
        <v-skeleton-loader
          class="rounded-xl"
          type="heading, image, paragraph"
        />
      </v-col>
    </v-row>
    <infinite-loading
      v-if="!$collections.complete"
      identifier="collections-bottom"
      :standalone="true"
      @infinite="getCollections"
    >
      <template #spinner>
        <div class="text-center">
          <v-progress-circular
            :size="36"
            :width="2"
            indeterminate
            :model-value="1"
          />
        </div>
      </template>
      <template #complete>
        <span />
      </template>
    </infinite-loading>
    <small>
      {{ $t("gallery.totalItems", { count: $collections.pager.totalItems }) }}
    </small>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CollectionCard from "@/components/Collections/CollectionCard.vue";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";
import CreateCollectionDialog from "@/components/Collections/Dialogs/Create.vue";
import { CollectionFilter } from "@/gql/graphql";
import InfiniteLoading from "@/components/Scroll/InfiniteScroll.vue";
import { StateHandler } from "@/components/Scroll/types";

export default defineComponent({
  name: "CollectionsHome",
  components: {
    InfiniteLoading,
    CreateCollectionDialog,
    GalleryNavigation,
    CollectionCard
  },
  data() {
    return {
      search: "",
      filter: [CollectionFilter.All],
      complete: false,
      create: false,
      loading: false,
      types: [
        {
          name: "All",
          internalName: CollectionFilter.All
        },
        {
          name: "Owned by me",
          internalName: CollectionFilter.Owned
        },
        {
          name: "Shared with me",
          internalName: CollectionFilter.Shared
        },
        {
          name: "Write access",
          internalName: CollectionFilter.Write
        },
        {
          name: "Configure access",
          internalName: CollectionFilter.Configure
        },
        {
          name: "Read-only access",
          internalName: CollectionFilter.Read
        }
      ]
    };
  },
  mounted() {
    this.$app.title = "Collections";
    if (this.$collections.items.length) return;
    this.$collections.getCollections(
      {
        search: this.search,
        filter: this.filter,
        page: 1
      },
      true
    );
  },
  methods: {
    async getCollections($state?: StateHandler, reset: boolean = false) {
      this.loading = true;
      if ($state) $state.loading();
      this.$collections.page++;
      const collections = await this.$collections.getCollections(
        {
          search: this.search,
          filter: this.filter,
          page: this.$collections.page
        },
        true,
        reset
      );
      if ($state) $state.loaded();
      if (!collections.items.length) {
        if ($state) $state.complete();
      }
      this.loading = false;
    }
  }
});
</script>
