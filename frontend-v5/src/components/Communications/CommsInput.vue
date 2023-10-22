<template>
  <text-field
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    placeholder="Keep it civil..."
    label="Send a message"
    ref="input"
    :textarea="true"
    :max-lines="7"
    :shift-enter-new-line="true"
  />
</template>

<script setup lang="ts">
import TextField from "@/components/Framework/Input/TextField.vue";
import { ref } from "vue";

const input = ref<InstanceType<typeof TextField> | null>(null);
const props = defineProps({
  modelValue: String
});
defineEmits(["update:modelValue"]);
defineExpose({ input });
</script>

<style scoped></style>
