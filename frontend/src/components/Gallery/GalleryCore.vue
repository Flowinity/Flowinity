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
          <v-icon>mdi-plus</v-icon>&nbsp;Select all
        </v-btn>
      </slot>
    </div>
    <div v-if="selected.length && supports.multiSelect" class="float-right">
      <slot name="multi-select-actions-length" :selected="selected">
        <v-btn class="rounded-xl ml-2" variant="text" @click="selectAll()">
          <v-icon>mdi-plus</v-icon>&nbsp;Select all
        </v-btn>
        <v-btn class="rounded-xl ml-2" variant="text" @click="deselectAll()">
          <v-icon>mdi-close</v-icon>&nbsp;Unselect all
        </v-btn>
        <v-btn
          class="rounded-xl"
          color="red darken-1"
          variant="text"
          @click="bulkDeleteConfirm()"
          ><v-icon>mdi-delete</v-icon> Delete Selected</v-btn
        >
        <v-btn
          class="rounded-xl ml-2"
          variant="text"
          @click="bulkAddCollection()"
        >
          <v-icon>mdi-folder-multiple-image</v-icon>&nbsp;Add to Collection
        </v-btn>
      </slot>
    </div>
    <br /><br />
    <v-row>
      <v-col
        v-for="item in items.gallery"
        :key="'item-' + item.id"
        md="6"
        sm="1"
        lg="3"
        cols="12"
      >
        <GalleryItem
          :item="item"
          :supports="supports"
          :selected="selected"
          @select="select($event)"
          @collectivize="
            addToCollectionDialog = true;
            collectivize = $event;
          "
        >
          <template v-for="(_, name) in $slots" v-slot:[name]="slotData"
            ><slot :name="name" v-bind="slotData"
          /></template>
        </GalleryItem>
      </v-col>
    </v-row>
    <v-pagination
      :length="items.pager?.totalPages"
      class="mt-3"
      v-model="pageComponent"
      :total-visible="$vuetify.display.xlAndUp ? 15 : undefined"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryItem from "@/components/Gallery/GalleryItem.vue";
import { Upload } from "@/models/upload";
import AddToCollection from "@/components/Gallery/Dialogs/AddToCollection.vue";
import { CollectionCache } from "@/types/collection";

export default defineComponent({
  name: "GalleryCore",
  components: { AddToCollection, GalleryItem },
  props: {
    items: {
      type: Object,
      required: true,
      default: () => {
        return {
          gallery: []
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
