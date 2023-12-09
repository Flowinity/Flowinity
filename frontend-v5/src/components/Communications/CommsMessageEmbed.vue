<template>
  <div v-if="embed?.type === 'image'">
    <img
      :style="{
        maxWidth: width <= 500 ? width + 'px' : 500 + 'px',
        maxHeight:
          embed?.data?.height > 400
            ? 700 + 'px'
            : embed?.data?.height * 2 + 'px'
      }"
      :src="embed?.data?.url"
      class="pointer rounded mb-1"
    />
  </div>
</template>

<script setup lang="ts">
import { Embed } from "@/gql/graphql";
import { computed } from "vue";

defineProps({
  embed: {
    type: Object as () => Embed
  }
});

const width = computed(() => {
  return 700;
});
</script>
