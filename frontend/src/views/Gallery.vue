<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          class="rounded-xl"
          v-model="show.search"
          append-icon="mdi-close"
          label="Search"
          @click:append="
            show.search = '';
            show.page = 1;
            getGallery();
          "
          v-on:keyup.enter="
            show.page = 1;
            getGallery();
          "
        ></v-text-field>
      </v-col>
      <v-col md="2">
        <v-select
          v-model="show.selected"
          :items="show.types"
          item-title="name"
          item-value="internalName"
          label="Filter"
          v-on:change="getGallery()"
        ></v-select>
      </v-col>
      <v-col md="2">
        <v-checkbox label="Search in files (metadata)" v-model="show.metadata">
        </v-checkbox>
      </v-col>
    </v-row>
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
    ></GalleryCore>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import { Upload } from "@/models/upload.model";
import { CollectionCache } from "@/types/collection";

export default defineComponent({
  name: "PersonalGallery",
  components: { GalleryCore },
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
      this.$app.componentLoading = true;
      const { data } = await this.axios.get("/gallery", {
        params: {
          page: this.page,
          search: this.show.search,
          textMetadata: this.show.metadata,
          filter: this.show.selected
        }
      });
      this.gallery = data;
      this.$app.componentLoading = false;
    }
  },
  mounted() {
    this.page = parseInt(this.$route.params.page) || 1;
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
