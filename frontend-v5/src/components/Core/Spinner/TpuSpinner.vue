<template>
  <svg
    class="spinner"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 66 66"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      class="path"
      fill="none"
      stroke-width="6"
      stroke-linecap="round"
      cx="33"
      cy="33"
      r="30"
    ></circle>
  </svg>
</template>

<script setup>
// Props
import { computed } from "vue";

const props = defineProps({
  size: {
    type: Number,
    default: 64
  },
  color: {
    type: String
  }
});

const color = computed(() => {
  return props.color || "white";
});
</script>

<style scoped lang="scss">
$offset: 187;
$duration: 1.2s;

.spinner {
  animation: rotator $duration linear infinite;
}

@keyframes rotator {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(270deg);
  }
}

.path {
  stroke-dasharray: $offset;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash $duration ease-in-out infinite;
  stroke: v-bind(color);
}

@keyframes dash {
  0% {
    stroke-dashoffset: $offset;
  }
  50% {
    stroke-dashoffset: calc($offset/4);
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: $offset;
    transform: rotate(450deg);
  }
}
</style>
