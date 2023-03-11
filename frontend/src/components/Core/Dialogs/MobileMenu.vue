<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    fullscreen
    max-height="50%"
  >
    <v-card style="bottom: 0; top: auto; position: absolute">
      <slot></slot>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MobileMenu",
  props: ["modelValue"],
  emits: ["update:modelValue"]
});
</script>

<style scoped></style>
