<template>
  <v-container v-if="collection">
    <CollectionBanner :collection="collection" />
    <Gallery
      ref="gallery"
      :type="GalleryType.AutoCollect"
      :name="`${collection.name} AutoCollects`"
      :path="`/autoCollect/${collection.id}`"
      :supports="{
        multiSelect: true,
        randomAttachment: false,
        permissions: {
          read: true,
          write: true,
          configure: true
        }
      }"
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
      <template v-slot:actions="{ item }: any">
        <HoverChip
          color="green"
          icon="mdi-check"
          text="Approve"
          @click="act(item.autoCollectApproval.id, 'approve')"
        />
        <HoverChip
          color="red"
          icon="mdi-close"
          text="Reject"
          @click="act(item.autoCollectApproval.id, 'deny')"
        />
        <HoverChip
          class="my-1"
          color="teal"
          icon="mdi-content-copy"
          text="Link"
          @click="$functions.copy($app.domain + item.attachment)"
        />
      </template>
    </Gallery>
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
import Gallery from "@/views/Gallery.vue";
import { GalleryType } from "@/gql/graphql";

export default defineComponent({
  name: "AutoCollectsItem",
  computed: {
    GalleryType() {
      return GalleryType;
    }
  },
  components: {
    Gallery,
    HoverChip,
    CollectionBanner,
    GalleryNavigation,
    GalleryCore
  },
  data() {
    return {
      collection: undefined as CollectionCache | undefined,
      gallery: {
        items: [] as Upload[]
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
    async act(id: number | number[], action: "approve" | "deny") {
      if (typeof id === "object") {
        const applicable = id.map((id) => {
          const objectWithID = this.$refs.gallery.gallery.gallery.items.find(
            (upload) => upload.id === id
          );
          return objectWithID ? objectWithID.autoCollectApproval.id : null;
        });
        await this.axios.post(`/autoCollects/bulk`, {
          action,
          ids: applicable
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
      const gallery = await this.$refs.gallery.gallery.getGallery();
      if (!gallery.items.length) await this.$router.push(`/autoCollect`);
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
      const data = await this.$collections.getCollection(this.$route.params.id);
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
