<template>
  <v-container>
    <GalleryNavigation
      @update:search="search = $event"
      @refreshGallery="$collections.init()"
      :supports="{ filter: true, metadata: false, search: true }"
      :types="types"
      @update:filter="filter = $event"
    ></GalleryNavigation>
    <v-row>
      <v-col
        v-for="item in collections"
        :key="'item-' + item.id + '-' + (item.shared ? 'shared' : 'owned')"
        md="3"
      >
        <CollectionCard :item="item"></CollectionCard>
      </v-col>
    </v-row>
    <small>Total Items: {{ $collections.items.length }}</small>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CollectionCard from "@/components/Collections/CollectionCard.vue";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";

export default defineComponent({
  name: "CollectionsHome",
  components: { GalleryNavigation, CollectionCard },
  data() {
    return {
      search: "",
      filter: "all",
      types: [
        {
          name: "All",
          internalName: "all"
        },
        {
          name: "Owned by me",
          internalName: "owned"
        },
        {
          name: "Shared with me",
          internalName: "shared"
        },
        {
          name: "Write access",
          internalName: "write"
        },
        {
          name: "Configure access",
          internalName: "configure"
        }
      ]
    };
  },
  computed: {
    collections() {
      if (this.filter === "all") {
        return this.$collections.items;
      } else if (this.filter === "owned") {
        return this.$collections.items.filter((item: any) => !item.shared);
      } else if (this.filter === "shared") {
        return this.$collections.items.filter((item: any) => item.shared);
      } else if (this.filter === "write") {
        return this.$collections.items.filter(
          (item: any) => item.permissionsMetadata.write
        );
      } else if (this.filter === "configure") {
        return this.$collections.items.filter(
          (item: any) => item.permissionsMetadata.configure
        );
      }
    }
  },
  mounted() {
    this.$app.title = "Collections";
    this.$collections.init();
  }
});
</script>

<style scoped></style>
