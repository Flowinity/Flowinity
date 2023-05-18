<template>
  <div id="gallery-core">
    <AddToCollection
      v-model="addToCollectionDialog"
      :items="collectivize"
      @collectionAdded="collectionAdded($event)"
    ></AddToCollection>
    <div v-if="!selected.length && supports.multiSelect" class="float-right">
      <slot name="multi-select-actions">
        <v-btn class="rounded-xl ml-2" variant="text" @click="selectAll()">
          <v-icon>mdi-plus</v-icon>
          &nbsp;{{ $t("gallery.selectAll") }}
        </v-btn>
      </slot>
    </div>
    <div v-if="selected.length && supports.multiSelect" class="float-right">
      <slot
        :deselectAll="deselectAll"
        :selectAll="selectAll"
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
    <v-row v-if="!$app.componentLoading">
      <v-col
        v-for="item in items.gallery"
        :key="'item-' + item.id"
        :lg="!inline ? 3 : 12"
        cols="12"
        md="6"
        sm="1"
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
          <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </GalleryItem>
      </v-col>
    </v-row>
    <!--
    <v-pagination
      :length="items.pager?.totalPages"
      class="mt-3"
      v-model="pageComponent"
      :total-visible="$vuetify.display.xlAndUp ? 15 : undefined"
    >
    </v-pagination>-->
    <Paginate
      v-model="pageComponent"
      :total-pages="items.pager?.totalPages"
      class="mt-10"
    ></Paginate>
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
import { Upload } from "@/models/upload";
import AddToCollection from "@/components/Gallery/Dialogs/AddToCollection.vue";
import { CollectionCache } from "@/types/collection";
import Paginate from "@/components/Core/Paginate.vue";

export default defineComponent({
  name: "GalleryCore",
  components: { Paginate, AddToCollection, GalleryItem },
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
      type: Object,
      required: true,
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
  data() {
    return {
      addToCollectionDialog: false,
      collectivize: null as number | number[] | null,
      selected: [] as number[]
    };
  },
  methods: {
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
    },
    select(item: Upload) {
      if (this.selected.includes(item.id)) {
        this.selected = this.selected.filter((i) => i !== item.id);
      } else {
        this.selected.push(item.id);
      }
    },
    bulkAddCollection() {
      this.addToCollectionDialog = true;
      this.collectivize = this.selected;
    },
    bulkDeleteConfirm() {
      this.$emit("bulkDeleteConfirm", this.selected);
    },
    selectAll() {
      this.selected = this.items.gallery.map((i: Upload) => i.id);
    },
    deselectAll() {
      this.selected = [];
    }
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
  }
});
</script>

<style scoped></style>
