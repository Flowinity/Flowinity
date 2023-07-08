<template>
  <v-dialog
    :fullscreen="$vuetify.display.mobile"
    :model-value="modelValue"
    v-bind="$attrs"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card class="no-border">
      <slot name="toolbar">
        <v-toolbar color="toolbar">
          <v-btn
            v-if="$vuetify.display.mobile"
            icon
            @click="$emit('update:modelValue', false)"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title>
            <slot name="title">Default title</slot>
          </v-toolbar-title>
          <v-btn
            v-if="!$vuetify.display.mobile"
            class="float-end"
            icon
            @click="$emit('update:modelValue', false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </slot>
      <slot></slot>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "CoreDialog",
  props: ["modelValue"],
  emits: ["update:modelValue"]
});
</script>

<style scoped></style>
