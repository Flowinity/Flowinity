<template>
  <div id="inline-gallery">
    <v-text-field
      v-model="show.search"
      label="Search"
      class="mt-5"
      autofocus
      @keydown.enter="getGallery"
      append-icon="mdi-magnify"
      @click:append="getGallery"
    ></v-text-field>
    <Paginate class="mb-2 mt-n2" :total-pages="null" v-model="page"></Paginate>
    <v-row>
      <v-col cols="12" sm="6" v-for="item in gallery.gallery" :item="item">
        <InlineGalleryItem
          :item="item"
          @clickItem="$emit('clickItem', $event)"
        ></InlineGalleryItem>
      </v-col>
    </v-row>
    <v-card-text class="text-center mt-5" v-if="!gallery.gallery.length">
      Enter a search term to find images.
    </v-card-text>
    <Paginate class="mt-5" :total-pages="null" v-model="page"></Paginate>
  </div>
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
      next: "",
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
      if (index === -1) return;
      this.gallery.gallery[index] = {
        ...this.gallery.gallery[index],
        collections: [...this.gallery.gallery[index]?.collections, collection]
      };
    },
    async getGallery(infinite: boolean = false) {
      let url;
      if (!infinite) {
        this.page = 1;
      }
      if (this.type === "starred") {
        url = "/gallery/starred";
      } else if (this.type === "tenor") {
        url = "/providers/tenor";
      } else {
        url = "/gallery";
      }
      if (this.type === "tenor" && !this.show.search) return;
      const { data } = await this.axios.get(url, {
        params: {
          page: this.page,
          search: this.show.search,
          textMetadata: this.show.metadata,
          filter: this.show.selected,
          next: this.next
        }
      });
      this.next = data.next;
      if (this.type === "tenor") return (this.gallery.gallery = data.results);
      this.gallery = data;
    }
  },
  mounted() {
    // infinite scroll for div with id="inline-gallery"
    const el = document.getElementById("inline-gallery");
    if (!el) return;
    el.addEventListener("scroll", () => {
      console.log(el.scrollTop, el.scrollHeight, el.clientHeight);
      if (
        el.scrollTop + el.clientHeight >=
        el.scrollHeight - el.clientHeight / 2
      ) {
        this.page++;
      }
    });
    this.getGallery();
  },
  watch: {
    page() {
      console.log("page changed");
      this.getGallery(true);
    }
  }
});
</script>

<style scoped></style>
