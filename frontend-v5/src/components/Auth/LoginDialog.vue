<template>
  <tpu-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #content>
      <Login @register="$emit('register')" />
    </template>
  </tpu-dialog>
</template>

<script setup lang="ts">
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import Login from "@/views/Login.vue";

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(["update:modelValue", "register"]);
</script>

<style scoped></style>
