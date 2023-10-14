<script setup lang="ts">
import theme from "@/plugins/theme";

const props = defineProps({
  color: {
    type: String,
    default: "badge-default-dark"
  }
});
</script>

<template>
  <span
    :class="`inline-block text-white px-2 py-1 rounded-full text-xs`"
    :style="{
      background:
        props.color !== undefined
          ? theme.colors[props.color || 'blue']?.['500'] ||
            theme.colors[props.color || 'blue']
          : undefined
    }"
  >
    <slot />
  </span>
</template>

<style scoped></style>
