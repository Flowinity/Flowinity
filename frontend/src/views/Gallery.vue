<template>
  <GalleryInfinite v-if="$experiments.experiments.GALLERY_INFINITE_SCROLL" />
  <GalleryPaginated v-else />
</template>
<script setup lang="ts">
import GalleryInfinite from "@/views/GalleryInfinite.vue";
import GalleryPaginated from "@/views/GalleryPaginated.vue";
</script>
