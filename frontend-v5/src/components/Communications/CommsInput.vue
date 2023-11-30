<template>
  <text-field
    ref="input"
    :model-value="modelValue"
    placeholder="Keep it civil..."
    label="Send a message"
    :textarea="true"
    :max-lines="7"
    :shift-enter-new-line="true"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import TextField from "@/components/Framework/Input/TextField.vue";
import { ref } from "vue";

const input = ref<InstanceType<typeof TextField> | null>(null);
defineProps({
  modelValue: String
});
defineEmits(["update:modelValue"]);
defineExpose({ input });
</script>
