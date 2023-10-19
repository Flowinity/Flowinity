<script setup lang="ts">
import theme from "@/plugins/theme";
import { ref } from "vue";

const props = defineProps({
  size: {
    default: 24,
    type: Number
  },
  src: {
    type: String
  },
  color: {
    type: [String, Boolean]
  },
  alt: {
    type: String
  }
});

const error = ref(false);

function loadError() {
  console.log("error");
  error.value = true;
}
</script>

<template>
  <div
    class="rounded-full whitespace-nowrap overflow-hidden overflow-ellipsis select-none"
    :class="{ gradient: props.color === true }"
    :style="`min-width: ${props.size}px; min-height: ${
      props.size
    }px; max-width: ${props.size}px; max-height: ${props.size}px; background: ${
      props.color !== undefined && !error
        ? theme.colors[props.color || 'blue']
        : undefined
    }`"
  >
    <slot name="outer" />
    <template v-if="props.src && !error">
      <img
        @error="loadError"
        style="width: 100%; height: 100%"
        :src="props.src"
        :alt="props.alt || 'Avatar'"
      />
    </template>
    <template v-else>
      <div class="flex items-center justify-center h-full">
        <slot />
      </div>
    </template>
  </div>
</template>

<style scoped>
.gradient {
  background: linear-gradient(to bottom, #03b8f8, #4181ea) !important;
}
</style>
