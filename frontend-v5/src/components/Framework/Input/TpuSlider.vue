<template>
  <div class="flex items-center justify-center">
    <label
      class="block mr-2 text-sm font-medium dark:text-medium-emphasis-dark"
      :for="id"
    >
      {{ label }}
    </label>
    <div
      :id="id + '-parent'"
      class="relative flex-1 w-full range-slider-parent"
    >
      <div :id="id + '-tooltip'" class="absolute pointer-events-none tooltip">
        {{ value }}
      </div>
      <input
        :id="id"
        v-model="value"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="w-full flex-1 h-2 dark:bg-blue dark:bg-opacity-10 rounded-lg appearance-none cursor-pointer accent-blue range-slider"
        :style="sliderBackgroundStyle"
      />
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: Number,
  min: Number,
  max: Number,
  step: {
    type: Number,
    default: 1
  },
  label: String,
  htmlId: String
});

const id = computed(() => {
  return props.htmlId || (Math.random() + 1).toString(36).substring(7);
});
const value = computed({
  get() {
    return props.modelValue.toString();
  },
  set(newValue) {
    emit("update:modelValue", parseInt(newValue));
  }
});

const emit = defineEmits(["update:modelValue"]);

const thumbPos = ref("0%");

watch(
  () => value.value,
  (val) => {
    updateTooltipPosition();
  }
);

function updateTooltipPosition() {
  const tooltip = document.getElementById(`${id.value}-tooltip`);
  if (!tooltip) return;
  const val = parseInt(value.value);
  const min = props.min ? props.min : 0;
  const max = props.max ? props.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));
  tooltip.style.left = newVal - 1.5 + "%";
  thumbPos.value = newVal + "%";
}

const sliderBackgroundStyle = computed(() => {
  return {
    background: `linear-gradient(to right, rgba(1, 144, 234, 1) ${thumbPos.value}, rgba(1, 144, 234, 0.1) ${thumbPos.value})`
  };
});

onMounted(() => {
  updateTooltipPosition();
});
</script>

<style scoped>
.tooltip {
  background: rgba(0, 0, 0, 0.8);
  top: -25px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 6px;
}
.tooltip {
  visibility: hidden;
}

.range-slider-parent:hover .tooltip {
  visibility: visible;
}
</style>
