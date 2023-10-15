<template>
  <card
    :secondary="true"
    class="rounded-t-xl rounded rounded-b-none whitespace-nowrap overflow-hidden overflow-ellipsis"
    :style="{ minHeight: props.height + 'px', maxHeight: props.height + 'px' }"
  >
    <slot />
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Core/Card/Card.vue";

const props = defineProps({
  height: {
    type: Number,
    default: 56
  }
});
</script>

<style scoped></style>
