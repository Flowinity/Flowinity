<template>
  <div
    class="rounded-full p-2 flex dark:text-white select-none cursor-pointer"
    v-wave
    :style="{
      background: `rgb(${rgbColor})`
    }"
    :class="{ 'outline dark:outline-outline-dark': !props.color }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import theme from "@/plugins/theme";
import { computed } from "vue";

const props = defineProps({
  icon: Boolean,
  to: String,
  href: String,
  color: String
});

const color = computed(() => {
  return theme.colors[props.color];
});

const rgbColor = computed(() => {
  if (!color.value) return;
  const [r, g, b] = color.value.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `${r},${g},${b},0.15`;
});
</script>

<style scoped>
:deep(.remixicon) {
  fill: v-bind(color);
}
</style>
