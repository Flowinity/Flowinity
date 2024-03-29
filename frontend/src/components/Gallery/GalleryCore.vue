<template>
  <div id="gallery-core">
    <OCRMetadata v-model="$app.dialogs.ocr.value" />
    <AddToCollection
      v-model="addToCollectionDialog"
      :items="collectivize"
      @collection-added="collectionAdded($event)"
    />
    <div v-if="!selected.length && supports.multiSelect" class="float-right">
      <slot name="multi-select-actions">
        <v-btn class="rounded-xl ml-2" variant="text" @click="selectAll()">
          <v-icon>mdi-plus</v-icon>
          &nbsp;{{ $t("gallery.selectAll") }}
        </v-btn>
      </slot>
    </div>
    <div v-if="selected.length && supports.multiSelect" class="float-right">
      <v-btn class="rounded-xl ml-2" variant="text" @click="download()">
        <v-icon class="mr-1">mdi-download</v-icon>
        {{ $t("gallery.downloadSelected") }}
      </v-btn>
      <slot
        :deselect-all="deselectAll"
        :select-all="selectAll"
        :selected="selected"
        name="multi-select-actions-length"
      >
        <v-btn class="rounded-xl ml-2" variant="text" @click="selectAll()">
          <v-icon class="mr-1">mdi-plus</v-icon>
          {{ $t("gallery.selectAll") }}
        </v-btn>
        <v-btn class="rounded-xl ml-2" variant="text" @click="deselectAll()">
          <v-icon class="mr-1">mdi-close</v-icon>
          {{ $t("gallery.deselectAll") }}
        </v-btn>
        <v-btn
          class="rounded-xl"
          color="red darken-1"
          variant="text"
          @click="bulkDeleteConfirm()"
        >
          <v-icon class="mr-1">mdi-delete</v-icon>
          {{ $t("gallery.deleteSelected") }}
        </v-btn>
        <v-btn
          class="rounded-xl ml-2"
          variant="text"
          @click="bulkAddCollection()"
        >
          <v-icon class="mr-1">mdi-folder-multiple-image</v-icon>
          {{ $t("gallery.collectSelected") }}
        </v-btn>
      </slot>
    </div>
    <br />
    <br />
    <v-row v-if="!loading">
      <v-col
        v-for="item in items.items"
        :key="'item-' + item.id"
        :lg="!inline ? 4 : 12"
        cols="12"
        md="6"
        sm="6"
        :xl="$app.workspaceDrawer ? 3 : 2"
      >
        <GalleryItem
          :item="item"
          :selected="selected"
          :supports="{
            ...supports,
            collections: true,
            permissions: {
              ...supports.permissions,
              write: item.user ? item.user.id === $user.user?.id : true
            }
          }"
          @collectivize="
            addToCollectionDialog = true;
            collectivize = $event;
          "
          @delete="$emit('delete', $event)"
          @refresh="$emit('refresh', $event)"
          @remove="$emit('remove', $event)"
          @select="select($event)"
        >
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </GalleryItem>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col
        v-for="item in 24"
        :key="item"
        :lg="!inline ? 3 : 12"
        cols="12"
        md="6"
        sm="1"
      >
        <GalleryItem :item="item" />
      </v-col>
    </v-row>
    <Paginate
      v-model="pageComponent"
      :total-pages="items.pager?.totalPages"
      class="mt-10"
      @update:model-value="resetScroll()"
    />
    <small>
      Total Pages: {{ items.pager?.totalPages.toLocaleString() }}
      <v-btn
        v-if="supports.randomAttachment"
        :loading="randomAttachmentLoading"
        style="float: right"
        @click="$emit('randomAttachment')"
      >
        Random Attachment
      </v-btn>
      <br />
      Total Items: {{ items.pager?.totalItems.toLocaleString() }}
    </small>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryItem from "@/components/Gallery/GalleryItem.vue";
import AddToCollection from "@/components/Gallery/Dialogs/AddToCollection.vue";
import { CollectionCache } from "@/types/collection";
import Paginate from "@/components/Core/Paginate.vue";
import OCRMetadata from "@/components/Gallery/Dialogs/OCRMetadata.vue";
import { Pager, Upload } from "@/gql/graphql";

export default defineComponent({
  components: { OCRMetadata, Paginate, AddToCollection, GalleryItem },
  props: {
    randomAttachmentLoading: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    items: {
      type: Object as () => {
        items: Upload[];
        pager: Pager;
      },
      default: () => {
        return {
          gallery: [],
          pager: {
            totalItems: 0,
            totalPages: 0
          }
        };
      }
    },
    page: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    supports: {
      type: Object,
      default: () => {
        return {
          multiSelect: false,
          randomAttachment: false,
          pins: false,
          permissions: {
            read: true,
            write: true,
            configure: true
          }
        };
      }
    }
  },
  emits: [
    "delete",
    "refresh",
    "remove",
    "randomAttachment",
    "updateItem",
    "page-change"
  ],
  data() {
    return {
      addToCollectionDialog: false,
      collectivize: null as number | number[] | null,
      selected: [] as number[],
      downloadingLoading: false,
      selectedMap: new Map<number, string>()
    };
  },
  computed: {
    pageComponent: {
      get() {
        return this.page;
      },
      set(value: number) {
        this.$emit("page-change", value);
      }
    }
  },
  methods: {
    download() {
      this.downloadingLoading = true;
      this.axios
        .post(
          "/gallery/download",
          {
            items: Array.from(this.selectedMap.values())
          },
          {
            responseType: "blob"
          }
        )
        .then((response) => {
          const url = window.URL.createObjectURL(
            new Blob([response.data], {
              type: "application/zip"
            })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `gallery-${this.$date().format("YYYY-MM-DD-HH-mm-ss")}.zip`
          );
          document.body.appendChild(link);
          link.click();
        })
        .finally(() => {
          this.downloadingLoading = false;
        });
    },
    resetScroll() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    collectionAdded({
      collection,
      items
    }: {
      collection: CollectionCache;
      items: number[] | number;
    }) {
      console.log("collectionAdded", collection, items);
      if (Array.isArray(items)) {
        for (const item of items) {
          this.$emit("updateItem", { item, collection });
        }
      } else {
        this.$emit("updateItem", { item: items, collection });
      }
      this.selected = [];
      this.selectedMap = new Map<number, string>();
    },
    select(item: Upload) {
      if (this.selected.includes(item.id)) {
        this.selected = this.selected.filter((i: number) => i !== item.id);
        this.selectedMap.delete(item.id);
      } else {
        this.selected.push(item.id);
        this.selectedMap.set(item.id, item.attachment);
      }
    },
    bulkAddCollection() {
      this.addToCollectionDialog = true;
      this.collectivize = this.selected;
    },
    async bulkDeleteConfirm() {
      await this.axios.post("/gallery/delete", {
        items: this.selected
      });
      this.$emit("refresh");
      this.$toast.success("Deleted selected items!");
    },
    selectAll() {
      this.selected = this.items.items.map((i: Upload) => i.id);
      this.selectedMap = new Map<number, string>(
        this.items.items.map((i: Upload) => [i.id, i.attachment])
      );
    },
    deselectAll() {
      this.selected = [];
      this.selectedMap = new Map<number, string>();
    }
  }
});
</script>
