<template>
  <div
    class="relative flex items-center justify-center"
    :style="{
      maxWidth: size,
      maxHeight: size
    }"
  >
    <svg
      :width="size"
      :height="size"
      :color="color"
      viewBox="0 0 66 66"
      xmlns="http://www.w3.org/2000/svg"
      :class="{ spinner: indeterminate }"
    >
      <circle
        class="path"
        fill="none"
        :stroke-width="innerWidth"
        stroke-linecap="round"
        :stroke="spinnerColor"
        :stroke-dasharray="indeterminate ? null : circumference"
        :stroke-dashoffset="indeterminate ? null : dashOffset"
        cx="33"
        cy="33"
        r="30"
        v-if="!indeterminate"
      ></circle>
      <circle
        v-else
        class="path-indeterminate"
        fill="none"
        :stroke-width="innerWidth"
        stroke-linecap="round"
        cx="33"
        cy="33"
        r="30"
      ></circle>
    </svg>
    <div class="absolute">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps({
  percentage: Number,
  color: String,
  size: {
    type: [Number, String]
  },
  innerWidth: {
    type: [Number, String],
    default: 4
  }
});

const spinnerColor = computed(() => {
  return props.color || "white";
});

const size = computed(() => {
  return props.size || 64;
});

const indeterminate = computed(() => props.percentage === undefined);

const circumference = ref(2 * Math.PI * 30);
const dashOffset = computed(() => {
  return indeterminate.value
    ? null
    : circumference.value * (1 - props.percentage! / 100);
});
</script>

<style scoped lang="scss">
$offset: 187;
$duration: 1.2s;

@keyframes rotator {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(270deg);
  }
}

.path {
  transform-origin: center;
  stroke: v-bind(spinnerColor);
  transform: rotate(260deg);
}

.spinner {
  animation: rotator $duration linear infinite;
}

.path-indeterminate {
  stroke-dasharray: $offset;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash $duration ease-in-out infinite;
  stroke: v-bind(spinnerColor);
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
