<template>
  <v-container v-if="collection">
    <Sharing
      v-model="sharing"
      :collection="collection"
      @get-collection="getCollection"
      @collection-users-push="collection?.users?.push($event)"
    ></Sharing>
    <CollectionBanner
      :collection="collection"
      @sharingDialog="sharing = true"
    ></CollectionBanner>
    <GalleryNavigation
      @update:show="show = $event"
      @update:search="
        show.search = $event;
        page = 1;
      "
      @refreshGallery="getGallery()"
      @update:filter="
        show.selected = $event;
        page = 1;
      "
      @update:metadata="
        show.metadata = $event;
        page = 1;
      "
      class="mt-1 ml-1"
    ></GalleryNavigation>
    <GalleryCore
      :page="page"
      :items="gallery"
      :supports="{
        multiSelect: true,
        randomAttachment: true,
        permissions: {
          read: true,
          write: true,
          configure: true
        }
      }"
      @refresh="getGallery()"
      @pageChange="$router.push(`/collections/${$route.params.id}/${$event}`)"
      @updateItem="updateItem"
    ></GalleryCore>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";
import CollectionBanner from "@/components/Collections/CollectionBanner.vue";
import { Upload } from "@/models/upload";
import { CollectionCache } from "@/types/collection";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import Sharing from "@/components/Collections/Dialogs/Sharing.vue";

export default defineComponent({
  name: "CollectionsItem",
  components: { Sharing, GalleryCore, CollectionBanner, GalleryNavigation },
  data() {
    return {
      collection: undefined as CollectionCache | undefined,
      gallery: {
        gallery: [] as Upload[]
      },
      page: 1,
      show: {
        search: "",
        metadata: true,
        selected: "all"
      },
      sharing: false
    };
  },
  methods: {
    updateItem({
      item,
      collection
    }: {
      item: number;
      collection: CollectionCache;
    }) {
      console.log(item, collection);
      const index = this.gallery.gallery.findIndex((i: any) => i.id === item);
      if (index === -1) return;
      this.gallery.gallery[index] = {
        ...this.gallery.gallery[index],
        collections: [...this.gallery.gallery[index].collections, collection]
      };
    },
    async getGallery() {
      this.$app.componentLoading = true;
      const { data } = await this.axios.get(
        `/collections/${this.$route.params.id}/gallery`,
        {
          params: {
            page: this.page,
            search: this.show.search,
            textMetadata: this.show.metadata,
            filter: this.show.selected
          }
        }
      );
      this.gallery = data;
      this.$app.componentLoading = false;
    },
    async getCollection() {
      if (!this.collection && this.$collections.items.length) {
        this.collection = this.$collections.items.find(
          (c: any) => c.id === parseInt(<string>this.$route.params.id)
        );
      }
      this.$app.componentLoading = true;
      const { data } = await this.axios.get(
        `/collections/${this.$route.params.id}`
      );
      this.$app.componentLoading = false;
      this.collection = data;
      this.$app.title = this.collection?.name as string;
    }
  },
  mounted() {
    this.$app.title = "Collection";
    this.page = parseInt(<string>this.$route.params.page) || 1;
    this.getCollection();
    this.getGallery();
  },
  watch: {
    "$route.params.page"(val) {
      if (!val) return;
      this.page = parseInt(<string>val) || 1;
      this.getGallery();
    },
    "$route.params.id"(val) {
      if (!val) return;
      this.getCollection();
      this.getGallery();
    }
  }
});
</script>

<style scoped></style>
