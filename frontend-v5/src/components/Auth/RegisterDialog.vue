<template>
  <tpu-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #content>
      <Register @login="$emit('login')" />
    </template>
  </tpu-dialog>
</template>

<script setup lang="ts">
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import Register from "@/views/Register.vue";

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(["update:modelValue", "login"]);
</script>

<style scoped></style>
