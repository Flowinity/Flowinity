<template>
  <v-row>
    <v-col>
      <v-text-field
        class="rounded-xl"
        v-model="search"
        append-icon="mdi-close"
        label="Search"
        @click:append="
          $emit('update:search', search);
          $emit('refreshGallery');
        "
        v-on:keyup.enter="
          $emit('update:search', search);
          $emit('refreshGallery');
        "
      ></v-text-field>
    </v-col>
    <v-col md="2" cols="12">
      <v-select
        :items="types"
        item-title="name"
        item-value="internalName"
        label="Filter"
        v-model="filter"
        v-on:change="$emit('update:filter', filter)"
      ></v-select>
    </v-col>
    <v-col md="2" cols="12">
      <v-checkbox
        label="Search in files (metadata)"
        v-model="metadata"
        v-on:change="$emit('update:metadata', metadata)"
      >
      </v-checkbox>
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
    "refreshGallery"
  ],
  data() {
    return {
      metadata: true,
      search: "",
      filter: "all",
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
      ]
    };
  }
};
</script>

<style scoped></style>
