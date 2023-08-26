<template>
  <v-container>
    <CreateCollectionDialog v-model="create"></CreateCollectionDialog>
    <GalleryNavigation
      :supports="{ filter: true, metadata: false, search: true }"
      :types="types"
      @refreshGallery="getCollections"
      v-model:search="search"
      @update:filter="filter = $event"
    ></GalleryNavigation>
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
        <CollectionCard :item="item"></CollectionCard>
      </v-col>
    </v-row>
    <small>
      {{ $t("gallery.totalItems", { count: $collections.pager.totalItems }) }}
    </small>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CollectionCard from "@/components/Collections/CollectionCard.vue";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";
import { Collection } from "@/models/collection";
import CreateCollectionDialog from "@/components/Collections/Dialogs/Create.vue";
import { CollectionFilter } from "@/gql/graphql";

export default defineComponent({
  name: "CollectionsHome",
  components: { CreateCollectionDialog, GalleryNavigation, CollectionCard },
  data() {
    return {
      search: "",
      filter: [CollectionFilter.All],
      create: false,
      page: 1,
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
  methods: {
    async getCollections() {
      console.log({
        search: this.search,
        filter: this.filter,
        page: this.page
      });
      await this.$collections.getCollections(
        {
          search: this.search,
          filter: this.filter,
          page: this.page
        },
        true
      );
    }
  },
  mounted() {
    this.$app.title = "Collections";
    this.$app.init();
  }
});
</script>

<style scoped></style>
