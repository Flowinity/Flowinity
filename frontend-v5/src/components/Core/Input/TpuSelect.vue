<template>
  <tpu-auto-complete
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="$props"
    :readonly="true"
    class="cursor-pointer select-none"
  >
    <slot />
  </tpu-auto-complete>
</template>

<script setup lang="ts">
import TextField from "@/components/Core/Input/TextField.vue";
import { computed, ref } from "vue";
import TpuAutoComplete from "@/components/Core/Input/TpuAutoComplete.vue";
const props = defineProps({
  modelValue: [String, Number, Boolean],
  items: {
    type: Object as () => {
      id: string | boolean | number;
      name: string;
      [key: string]: any;
    }[]
  },
  disabled: Boolean
});
defineEmits(["update:modelValue"]);
</script>
