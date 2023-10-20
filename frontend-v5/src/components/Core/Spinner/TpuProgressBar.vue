<template>
  <div class="w-full rounded-xl relative">
    <div
      class="w-full h-5 bg-blue rounded-xl bg-opacity-10 relative overflow-hidden"
      :style="{ height: height + 'px' }"
    >
      <div class="h-full bg-blue" :style="progressStyle"></div>
      <slot>
        <div class="absolute top-0 w-full flex items-center justify-center">
          {{ percentage }}%
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Define props
const props = defineProps({
  percentage: Number,
  showText: Boolean,
  height: {
    type: Number,
    default: 22
  }
});

// Calculate the width of the progress bar based on the percentage
const progressStyle = computed(() => ({
  width: `${props.percentage}%`
}));
</script>
