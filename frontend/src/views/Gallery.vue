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
      :supports="
        supports || {
          multiSelect: true,
          randomAttachment: true,
          permissions: {
            read: true,
            write: true,
            configure: true
          }
        }
      "
      @refresh="getGallery()"
      @page-change="$router.push(`${path}/${$event}`)"
      @updateItem="updateItem"
      @delete="deleteItem"
      @remove="removeItemFromCollection($event.item, $event.collection)"
      @random-attachment="randomAttachment"
      :random-attachment-loading="randomLoading"
      :path="path"
      :show="show"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </GalleryCore>
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
  props: ["path", "endpoint", "name", "random", "supports"],
  data() {
    return {
      gallery: {
        gallery: [] as Upload[],
        pager: {
          totalItems: 0,
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
        selected: "all",
        sort: "newest"
      },
      randomLoading: false
    };
  },
  methods: {
    async randomAttachment() {
      this.randomLoading = true;
      const { data } = await this.axios.get(
        this.random || `${this.endpoint}/random`
      );
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
      this.gallery.gallery[index] = <Upload>{
        ...this.gallery.gallery[index],
        collections: this.gallery.gallery[index]?.collections.filter(
          (c: any) => c.id !== collection.id
        )
      };
    },
    deleteItem(item: Upload) {
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
      const { data } = await this.axios.get(this.endpoint, {
        params: {
          page: this.page,
          search: this.show.search,
          textMetadata: this.show.metadata,
          filter: this.show.selected,
          sort: `"${this.show.sort}"`
        }
      });
      this.gallery = data as typeof this.gallery;
      this.$app.componentLoading = false;
    },
    socketRegister(
      uploads:
        | { upload: Upload; url: string }
        | { upload: Upload; url: string }[]
    ) {
      if (this.page !== 1) return;
      if (Array.isArray(uploads)) {
        for (const upload of uploads) {
          this.gallery.gallery.unshift(upload.upload);
        }
      } else {
        this.gallery.gallery.unshift(uploads.upload);
      }
    },
    init() {
      this.$socket.off("gallery/create", this.socketRegister);
      this.$app.title = this.name || "Gallery";
      this.page = parseInt(<string>this.$route.params.page) || 1;
      this.getGallery();
      if (this.endpoint === "/gallery") {
        this.$socket.on("gallery/create", this.socketRegister);
      }
    }
  },
  mounted() {
    this.init();
  },
  unmounted() {
    if (this.endpoint === "/gallery") {
      this.$socket.off("gallery/create", this.socketRegister);
    }
  },
  watch: {
    "$route.params.page"(page) {
      if (!page) return;
      this.page = parseInt(page) || 1;
      this.getGallery();
    },
    endpoint() {
      this.init();
    }
  }
});
</script>

<style scoped></style>
