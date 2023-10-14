<template>
  <div
    class="grid md:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-5 2xl:grid-cols-4 sm:grid-cols-1 gap-4 p-4"
  >
    <gallery-item v-for="item in props.items" :item="item" :key="item.id" />
  </div>
</template>

<script setup lang="ts">
import GalleryItem from "@/components/Gallery/GalleryItem.vue";
import type { Upload } from "@/gql/graphql";

const props = defineProps({
  items: {
    type: Object as () => Upload[]
  }
});
</script>

<style scoped></style>
