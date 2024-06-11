<template>
  <component v-bind="$props" :is="GalleryPaginated" ref="galleryRef">
    <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </component>
</template>
<script setup lang="ts">
import GalleryInfinite from "@/views/GalleryInfinite.vue";
import GalleryPaginated from "@/views/GalleryPaginated.vue";
import { ref } from "vue";

const galleryRef = ref(null);

defineExpose({
  gallery: galleryRef
});
</script>
