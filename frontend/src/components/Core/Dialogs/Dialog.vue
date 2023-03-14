<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="$attrs"
    :fullscreen="$vuetify.display.mobile"
  >
    <v-card class="no-border">
      <v-toolbar color="toolbar">
        <v-btn
          icon
          @click="$emit('update:modelValue', false)"
          v-if="$vuetify.display.mobile"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>
          <slot name="title">Default title</slot>
        </v-toolbar-title>
        <v-btn
          icon
          @click="$emit('update:modelValue', false)"
          v-if="!$vuetify.display.mobile"
          class="float-end"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <slot></slot>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CoreDialog",
  props: ["modelValue"],
  emits: ["update:modelValue"]
});
</script>

<style scoped></style>
