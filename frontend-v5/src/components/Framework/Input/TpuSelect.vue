<template>
  <tpu-auto-complete
    :model-value="modelValue"
    v-bind="$props"
    :readonly="true"
    class="cursor-pointer select-none"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <slot />
  </tpu-auto-complete>
</template>

<script setup lang="ts">
import TpuAutoComplete from "@/components/Framework/Input/TpuAutoComplete.vue";
defineProps({
  modelValue: [String, Number, Boolean]
});
defineEmits(["update:modelValue"]);
</script>
