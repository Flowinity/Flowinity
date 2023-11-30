<template>
  <tpu-button
    variant="passive"
    icon
    class="select-none"
    :disabled="props.disabled"
    :style="{ maxWidth: px, maxHeight: px, minWidth: px, minHeight: px }"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <RiCheckboxBlankLine
      v-if="!modelValue"
      class="w-full h-full"
      :style="{ color }"
    />
    <RiCheckboxFill v-else class="w-full h-full" :style="{ color }" />
    <span v-if="props.label" class="text-gray-900 dark:text-white">
      {{ props.label }}
    </span>
  </tpu-button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import RiCheckboxBlankLine from "vue-remix-icons/icons/ri-checkbox-blank-line.vue";
import RiCheckboxFill from "vue-remix-icons/icons/ri-checkbox-fill.vue";
import theme from "@/plugins/theme";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";

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

defineEmits(["update:modelValue"]);
</script>
