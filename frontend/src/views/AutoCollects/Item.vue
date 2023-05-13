<template>
  <v-container v-if="collection">
    <CollectionBanner :collection="collection"></CollectionBanner>
    <PersonalGallery
      :endpoint="`/autoCollects/${collection.id}`"
      :path="`/autoCollects/${collection.id}`"
      :name="`${collection.name} AutoCollects`"
      :supports="{
        multiSelect: true,
        randomAttachment: false,
        permissions: {
          read: true,
          write: true,
          configure: true
        }
      }"
      ref="gallery"
    >
      <template v-slot:multi-select-actions-length="slotProps: any">
        <v-btn class="rounded-xl ml-2" @click="slotProps.selectAll()">
          <v-icon>mdi-plus</v-icon>
          &nbsp;Select all
        </v-btn>
        <v-btn class="rounded-xl ml-2" @click="slotProps.deselectAll()">
          <v-icon>mdi-close</v-icon>
          &nbsp;Unselect all
        </v-btn>
        <v-btn
          class="rounded-xl"
          color="red darken-1"
          @click="
            act(slotProps.selected, 'deny');
            slotProps.deselectAll();
          "
        >
          <v-icon>mdi-close</v-icon>
          Reject all
        </v-btn>
        <v-btn
          class="rounded-xl ml-2"
          color="success"
          @click="
            act(slotProps.selected, 'approve');
            slotProps.deselectAll();
          "
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
          @click="act(item.autoCollectApproval.id, 'approve')"
        ></HoverChip>
        <HoverChip
          text="Reject"
          icon="mdi-close"
          color="red"
          @click="act(item.autoCollectApproval.id, 'deny')"
        ></HoverChip>
        <HoverChip
          text="Link"
          icon="mdi-content-copy"
          color="teal"
          @click="$functions.copy($app.domain + item.attachment)"
          class="my-1"
        ></HoverChip>
      </template>
    </PersonalGallery>
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
import PersonalGallery from "@/views/Gallery.vue";

export default defineComponent({
  name: "AutoCollectsItem",
  components: {
    PersonalGallery,
    HoverChip,
    CollectionBanner,
    GalleryNavigation,
    GalleryCore
  },
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
      this.$refs.gallery?.getGallery();
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
      if (this.collection)
        this.$app.title = this.collection.name + " - AutoCollects";
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
    this.$app.title = "AutoCollects";
  }
});
</script>

<style scoped></style>
