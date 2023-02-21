<template>
  <v-row>
    <v-col cols="12" sm="6" v-for="item in gallery.gallery" :item="item">
      <InlineGalleryItem
        :item="item"
        @clickItem="$emit('clickItem', $event)"
      ></InlineGalleryItem>
    </v-col>
  </v-row>
  <Paginate
    class="mt-2"
    :total-pages="gallery.pager?.totalPages"
    v-model="page"
  ></Paginate>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import { Upload } from "@/models/upload";
import { CollectionCache } from "@/types/collection";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";
import InlineGalleryItem from "@/components/Communications/InlineGalleryItem.vue";
import Paginate from "@/components/Core/Paginate.vue";

export default defineComponent({
  name: "InlineStarred",
  components: { Paginate, InlineGalleryItem, GalleryNavigation, GalleryCore },
  props: ["type"],
  data() {
    return {
      gallery: {
        gallery: [] as Upload[],
        pager: {
          totalPages: 0
        }
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
        selected: "all"
      }
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
      if (!index) return;
      this.gallery.gallery[index] = {
        ...this.gallery.gallery[index],
        collections: [...this.gallery.gallery[index].collections, collection]
      };
    },
    async getGallery() {
      const url = this.type === "starred" ? "/gallery/starred" : "/gallery";
      const { data } = await this.axios.get(url, {
        params: {
          page: this.page,
          search: this.show.search,
          textMetadata: this.show.metadata,
          filter: this.show.selected
        }
      });
      this.gallery = data;
    }
  },
  mounted() {
    this.getGallery();
  },
  watch: {
    page() {
      this.getGallery();
    }
  }
});
</script>

<style scoped></style>
