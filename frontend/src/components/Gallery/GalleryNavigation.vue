<template>
  <v-row>
    <v-col v-if="supports.search">
      <GalleryTextField
        :model-value="search"
        v-on:update:model-value="$emit('update:search', $event)"
        @refreshGallery="$emit('refreshGallery')"
      />
    </v-col>
    <v-col v-if="supports.sort" cols="12" md="1">
      <v-select
        v-model="order"
        :items="orderTypes"
        :label="$t('generic.order')"
        item-title="name"
        item-value="internalName"
        v-on:update:model-value="
          $emit('update:order', order);
          $emit('refreshGallery');
        "
      ></v-select>
    </v-col>
    <v-col v-if="supports.sort" cols="12" md="2">
      <v-select
        v-model="sort"
        :items="sortTypes"
        :label="$t('generic.sort')"
        item-title="name"
        item-value="internalName"
        v-on:update:model-value="
          $emit('update:sort', sort);
          $emit('refreshGallery');
        "
      ></v-select>
    </v-col>
    <v-col v-if="supports.filter" cols="12" md="2">
      <v-select
        v-model="filter"
        :items="types"
        :label="$t('generic.filter')"
        item-title="name"
        item-value="internalName"
        v-on:update:model-value="
          $emit('update:filter', filter);
          $emit('refreshGallery');
        "
        :multiple="true"
      ></v-select>
    </v-col>
    <v-col v-if="supports.metadata" cols="12" sm="2" xl="auto">
      <v-checkbox
        v-model="metadata"
        :label="$t('generic.metadata')"
        v-on:change="
          $emit('update:metadata', metadata);
          $emit('refreshGallery');
        "
      ></v-checkbox>
    </v-col>
    <v-col sm="auto" align-self="center">
      <v-icon class="pointer" @click="$emit('refreshGallery')">
        mdi-magnify
      </v-icon>
    </v-col>
    <v-col v-if="supports.upload" sm="1">
      <v-btn block class="mt-2" @click="$app.dialogs.upload.value = true">
        <v-icon class="mr-1">mdi-upload</v-icon>
        {{ $t("generic.upload") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { GalleryFilter, GalleryOrder, GallerySort } from "@/gql/graphql";
import GalleryTextField from "@/components/Gallery/GalleryTextField.vue";

export default defineComponent({
  name: "GalleryNavigation",
  components: { GalleryTextField },
  emits: [
    "update:filter",
    "update:search",
    "update:metadata",
    "refreshGallery",
    "update:sort",
    "update:order"
  ],
  props: {
    search: {
      type: String,
      required: false,
      default: ""
    },
    supports: {
      type: Object,
      required: false,
      default: {
        filter: true,
        metadata: true,
        search: true,
        upload: false,
        sort: true
      }
    },
    orderTypes: {
      type: Array,
      required: false,
      default: [
        {
          name: "Ascending",
          internalName: GalleryOrder.Asc
        },
        {
          name: "Descending",
          internalName: GalleryOrder.Desc
        }
      ]
    },
    sortTypes: {
      type: Array,
      required: false,
      default: [
        {
          name: "Created at",
          internalName: GallerySort.CreatedAt
        },
        {
          name: "Name",
          internalName: GallerySort.Name
        },
        {
          name: "Size",
          internalName: GallerySort.Size
        }
      ]
    },
    types: {
      type: Array,
      required: false,
      default: [
        {
          name: "All of them",
          internalName: GalleryFilter.All
        },
        {
          name: "Not collectivized",
          internalName: GalleryFilter.NoCollection
        },
        {
          name: "Images",
          internalName: GalleryFilter.Images
        },
        {
          name: "Videos",
          internalName: GalleryFilter.Videos
        },
        {
          name: "Audio",
          internalName: GalleryFilter.Audio
        },
        {
          name: "Text",
          internalName: GalleryFilter.Text
        },
        {
          name: "Other",
          internalName: GalleryFilter.Other
        },
        {
          name: "Include Deletable",
          internalName: GalleryFilter.IncludeDeletable
        },
        {
          name: "Owned items",
          internalName: GalleryFilter.Owned
        },
        {
          name: "Not owned items",
          internalName: GalleryFilter.Shared
        }
      ]
    }
  },
  data() {
    return {
      metadata: true,
      filter: [GalleryFilter.All],
      sort: GallerySort.CreatedAt,
      order: GalleryOrder.Desc
    };
  }
});
</script>

<style scoped></style>
