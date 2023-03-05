<template>
  <v-row>
    <v-col v-if="supports.search">
      <v-text-field
        class="rounded-xl"
        v-model="search"
        append-inner-icon="mdi-close"
        label="Search"
        @click:append-inner="
          search = '';
          $emit('update:search', '');
          $emit('refreshGallery');
        "
        v-on:keyup.enter="
          $emit('update:search', search);
          $emit('refreshGallery');
        "
      ></v-text-field>
    </v-col>
    <v-col md="2" cols="12" v-if="supports.sort">
      <v-select
        :items="sortTypes"
        item-title="name"
        item-value="internalName"
        label="Sort"
        v-model="sort"
        v-on:update:model-value="
          $emit('update:sort', sort);
          $emit('refreshGallery');
        "
      ></v-select>
    </v-col>
    <v-col md="2" cols="12" v-if="supports.filter">
      <v-select
        :items="types"
        item-title="name"
        item-value="internalName"
        label="Filter"
        v-model="filter"
        v-on:update:model-value="
          $emit('update:filter', filter);
          $emit('refreshGallery');
        "
      ></v-select>
    </v-col>
    <v-col xl="2" sm="2" cols="12" v-if="supports.metadata">
      <v-checkbox
        label="Search in files"
        v-model="metadata"
        v-on:change="
          $emit('update:metadata', metadata);
          $emit('refreshGallery');
        "
      ></v-checkbox>
    </v-col>
    <v-col sm="1" v-if="supports.upload">
      <v-btn block class="mt-2" @click="$app.dialogs.upload.value = true">
        <v-icon>mdi-upload</v-icon>
        Upload
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: "GalleryNavigation",
  emits: [
    "update:filter",
    "update:search",
    "update:metadata",
    "refreshGallery",
    "update:sort"
  ],
  props: {
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
    sortTypes: {
      type: Array,
      required: false,
      default: [
        {
          name: "Newest",
          internalName: "newest"
        },
        {
          name: "Oldest",
          internalName: "oldest"
        },
        {
          name: "Size",
          internalName: "size"
        }
      ]
    },
    types: {
      type: Array,
      required: false,
      default: [
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
          name: "GIFs",
          internalName: "gif"
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
      ]
    }
  },
  data() {
    return {
      metadata: true,
      search: "",
      filter: "all",
      sort: "newest"
    };
  }
};
</script>

<style scoped></style>
