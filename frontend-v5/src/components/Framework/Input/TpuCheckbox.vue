<template>
  <div
    class="select-none items-center flex cursor-pointer"
    @click="props.disabled ? () => {} : $emit('update:modelValue', !modelValue)"
  >
    <RiCheckboxBlankLine
      class="w-full h-full"
      :style="{
        maxWidth: px,
        maxHeight: px,
        minWidth: px,
        minHeight: px,
        color
      }"
      v-if="!modelValue"
    />
    <RiCheckboxFill
      class=""
      v-else
      :style="{
        maxWidth: px,
        maxHeight: px,
        minWidth: px,
        minHeight: px,
        color
      }"
    />
    <span
      class="text-gray-900 dark:text-white ml-2"
      v-if="props.label || $slots.label"
    >
      <slot name="label">
        {{ props.label }}
      </slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
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
      return "20px";
    case "m":
      return "25px";
    case "l":
      return "40px";
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
