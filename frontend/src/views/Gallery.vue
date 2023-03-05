<template>
  <v-container>
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
      :supports="{
        filter: true,
        metadata: true,
        search: true,
        upload: true,
        sort: true
      }"
      @update:sort="
        show.sort = $event;
        page = 1;
      "
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
      @page-change="$router.push(`/gallery/${$event}`)"
      @updateItem="updateItem"
      @delete="deleteItem"
      @remove="removeItemFromCollection($event.item, $event.collection)"
      @random-attachment="randomAttachment"
      :random-attachment-loading="randomLoading"
    ></GalleryCore>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import { Upload } from "@/models/upload";
import { CollectionCache } from "@/types/collection";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";

export default defineComponent({
  name: "PersonalGallery",
  components: { GalleryNavigation, GalleryCore },
  data() {
    return {
      gallery: {
        gallery: [] as Upload[]
      },
      page: 1,
      show: {
        types: [
          {
            name: "All of them",
            internalName: "all"
          },
          {
            name: "Not collectivized",
            internalName: "nonCollectivized"
          },
          {
            name: "Images",
            internalName: "image"
          },
          {
            name: "Videos",
            internalName: "video"
          },
          {
            name: "Audio",
            internalName: "audio"
          },
          {
            name: "Text",
            internalName: "text"
          },
          {
            name: "Other",
            internalName: "binary"
          }
        ],
        search: "",
        metadata: true,
        selected: "all",
        sort: "newest"
      },
      randomLoading: false
    };
  },
  methods: {
    async randomAttachment() {
      this.randomLoading = true;
      const { data } = await this.axios.get("/gallery/random");
      this.$functions.copy(
        "https://" + this.$user.user?.domain.domain + "/i/" + data.attachment
      );
      this.randomLoading = false;
    },
    removeItemFromCollection(item: Upload, collection: CollectionCache) {
      const index = this.gallery.gallery.findIndex(
        (i: Upload) => i.id === item.id
      );
      if (index === -1) return;
      this.gallery.gallery[index] = {
        ...this.gallery.gallery[index],
        collections: this.gallery.gallery[index]?.collections.filter(
          (c: any) => c.id !== collection.id
        )
      };
    },
    deleteItem(item: Upload) {
      console.log(item.id);
      const index = this.gallery.gallery.findIndex(
        (i: any) => i.id === item.id
      );
      if (index === -1) return;
      this.gallery.gallery.splice(index, 1);
    },
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
        collections: [...this.gallery.gallery[index]?.collections, collection]
      };
    },
    async getGallery() {
      this.$app.componentLoading = true;
      const { data } = await this.axios.get("/gallery", {
        params: {
          page: this.page,
          search: this.show.search,
          textMetadata: this.show.metadata,
          filter: this.show.selected,
          sort: this.show.sort
        }
      });
      this.gallery = data;
      this.$app.componentLoading = false;
    }
  },
  mounted() {
    this.$app.title = "Gallery";
    this.page = parseInt(<string>this.$route.params.page) || 1;
    this.getGallery();
  },
  watch: {
    "$route.params.page"(page) {
      if (!page) return;
      this.page = parseInt(page) || 1;
      this.getGallery();
    }
  }
});
</script>

<style scoped></style>
