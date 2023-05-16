<template>
  <v-container>
    <CreateCollectionDialog v-model="create"></CreateCollectionDialog>
    <GalleryNavigation
      :supports="{ filter: true, metadata: false, search: true }"
      :types="types"
      @refreshGallery="$collections.init()"
      @update:search="search = $event"
      @update:filter="filter = $event"
    ></GalleryNavigation>
    <v-btn class="mt-1 ml-1" style="float: right" @click="create = true">
      Create Collection
    </v-btn>
    <br />
    <br />
    <br />
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
import { Collection } from "@/models/collection";
import CreateCollectionDialog from "@/components/Collections/Dialogs/Create.vue";

export default defineComponent({
  name: "CollectionsHome",
  components: { CreateCollectionDialog, GalleryNavigation, CollectionCard },
  data() {
    return {
      search: "",
      filter: "all",
      create: false,
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
      const items = this.$collections.items.filter((item: Collection) =>
        item.name.toLowerCase().includes(this.search.toLowerCase())
      );
      if (this.filter === "all") {
        return items;
      } else if (this.filter === "owned") {
        return items.filter((item: any) => !item.shared);
      } else if (this.filter === "shared") {
        return items.filter((item: any) => item.shared);
      } else if (this.filter === "write") {
        return items.filter((item: any) => item.permissionsMetadata.write);
      } else if (this.filter === "configure") {
        return items.filter((item: any) => item.permissionsMetadata.configure);
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
