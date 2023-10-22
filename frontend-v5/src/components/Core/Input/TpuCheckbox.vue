<template>
  <tpu-button
    variant="passive"
    icon
    class="select-none"
    @click="$emit('update:modelValue', !modelValue)"
    :disabled="props.disabled"
    :style="{ maxWidth: px, maxHeight: px, minWidth: px, minHeight: px }"
  >
    <RiCheckboxBlankLine
      class="w-full h-full"
      :style="{ color }"
      v-if="!modelValue"
    />
    <RiCheckboxFill class="w-full h-full" v-else :style="{ color }" />
    <span class="text-gray-900 dark:text-white" v-if="props.label">
      {{ props.label }}
    </span>
  </tpu-button>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import RiCheckboxBlankLine from "vue-remix-icons/icons/ri-checkbox-blank-line.vue";
import RiCheckboxFill from "vue-remix-icons/icons/ri-checkbox-fill.vue";
import theme from "@/plugins/theme";
import TpuButton from "@/components/Core/Button/TpuButton.vue";

const props = defineProps({
  modelValue: Boolean,
  label: String,
  color: {
    type: String,
    default: "blue"
  },
  disabled: Boolean,
  size: {
    type: String as () => "s" | "m" | "l",
    default: "m"
  }
});

const px = computed(() => {
  switch (props.size) {
    case "s":
      return "38px";
    case "m":
      return "40px";
    case "l":
      return "60px";
  }
});

const color = computed(() => {
  if (!props.modelValue) {
    return "#ffffff";
  }
  return theme.colors[props.color];
});

const emits = defineEmits(["update:modelValue"]);
</script>
