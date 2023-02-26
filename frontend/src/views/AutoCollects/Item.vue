<template>
  <v-container v-if="collection">
    <CollectionBanner :collection="collection"></CollectionBanner>
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
    ></GalleryNavigation>
    <GalleryCore
      :page="page"
      :items="gallery"
      :supports="{
        multiSelect: true,
        randomAttachment: false,
        permissions: {
          read: true,
          write: true,
          configure: true
        }
      }"
      @refresh="getGallery()"
      @pageChange="$router.push(`/autoCollect/${$route.params.id}/${$event}`)"
      @updateItem="updateItem"
    >
      <template v-slot:multi-select-actions-length="{ selected }">
        <v-btn class="rounded-xl ml-2" text @click="selectAll(selected)">
          <v-icon>mdi-plus</v-icon>
          &nbsp;Select all
        </v-btn>
        <v-btn class="rounded-xl ml-2" text @click="deselectAll(selected)">
          <v-icon>mdi-close</v-icon>
          &nbsp;Unselect all
        </v-btn>
        <v-btn
          class="rounded-xl"
          color="red darken-1"
          text
          @click="act($event, 'deny')"
        >
          <v-icon>mdi-close</v-icon>
          Reject all
        </v-btn>
        <v-btn
          class="rounded-xl ml-2"
          color="success"
          text
          @click="act($event, 'approve')"
        >
          <v-icon>mdi-check</v-icon>
          &nbsp;Accept all
        </v-btn>
      </template>
      <template v-slot:actions="{ item }">
        <HoverChip
          text="Approve"
          icon="mdi-check"
          color="green"
          @click="act(item.id, 'approve')"
        ></HoverChip>
        <HoverChip
          text="Reject"
          icon="mdi-close"
          color="red"
          @click="act(item.id, 'deny')"
        ></HoverChip>
        <HoverChip
          text="Link"
          icon="mdi-content-copy"
          color="teal"
          @click="$functions.copy($app.domain + item.attachment)"
          class="my-1"
        ></HoverChip>
      </template>
    </GalleryCore>
  </v-container>
</template>

<script lang="ts">
import { CollectionCache } from "@/types/collection";
import { defineComponent } from "vue";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";
import CollectionBanner from "@/components/Collections/CollectionBanner.vue";
import { Upload } from "@/models/upload";
import HoverChip from "@/components/Core/HoverChip.vue";

export default defineComponent({
  name: "AutoCollectsItem",
  components: { HoverChip, CollectionBanner, GalleryNavigation, GalleryCore },
  data() {
    return {
      collection: undefined as CollectionCache | undefined,
      gallery: {
        gallery: [] as Upload[]
      },
      page: 1,
      show: {
        search: "",
        metadata: "",
        selected: "all"
      }
    };
  },
  methods: {
    async act(id: number | object, action: "approve" | "deny") {
      if (typeof id === "object") {
        await this.axios.post(`/autoCollects/bulk`, {
          action,
          ids: id
        });
      } else {
        await this.axios.post(`/autoCollects/${id}`, {
          action
        });
      }
      const type =
        action === "approve"
          ? "auto-collect-accepted"
          : "auto-collect-rejected";
      this.$functions.doSinglePulse(type, {
        collectionId: this.collection?.id,
        count: 1
      });
      this.$toast.success("Action performed");
      this.getGallery();
    },
    updateItem({
      item,
      collection
    }: {
      item: number;
      collection: CollectionCache;
    }) {
      const index = this.gallery.gallery.findIndex((i: any) => i.id === item);
      if (index === -1) return;
      this.gallery.gallery[index] = {
        ...this.gallery.gallery[index],
        collections: [...this.gallery.gallery[index]?.collections, collection]
      };
    },
    async getGallery() {
      this.$app.componentLoading = true;
      const { data } = await this.axios.get(
        `/autoCollects/${this.$route.params.id}`,
        {
          params: {
            page: this.page,
            search: this.show.search,
            textMetadata: this.show.metadata,
            filter: this.show.selected
          }
        }
      );
      if (!data.gallery.length) {
        this.$app.componentLoading = false;
        this.$router.push(`/autoCollect`);
        return;
      }
      // TODO: AutoCollect type
      this.gallery = data;
      this.gallery.gallery = data.gallery.map((autoCollect: any) => {
        return {
          ...autoCollect,
          id: autoCollect.autoCollectApproval.id
        };
      });
      this.$app.componentLoading = false;
    },
    async getCollection() {
      if (!this.collection && this.$collections.items.length) {
        this.collection = this.$collections.items.find(
          (c: CollectionCache) =>
            c.id === parseInt(<string>this.$route.params.id)
        );
      }
      this.$app.componentLoading = true;
      const { data } = await this.axios.get(
        `/collections/${this.$route.params.id}`
      );
      this.$app.componentLoading = false;
      this.collection = data;
    },
    selectAll(selected: any[]) {
      //
    },
    deselectAll(selected: any[]) {
      //
    }
  },
  mounted() {
    this.getCollection();
    this.getGallery();
  }
});
</script>

<style scoped></style>
