<template>
  <v-row>
    <v-col v-if="supports.search">
      <v-text-field
        v-model="search"
        :label="$t('generic.search')"
        append-inner-icon="mdi-close"
        class="rounded-xl"
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
    <v-col v-if="supports.upload" sm="1">
      <v-btn block class="mt-2" @click="$app.dialogs.upload.value = true">
        <v-icon class="mr-1">mdi-upload</v-icon>
        {{ $t("generic.upload") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
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
});
</script>

<style scoped></style>
