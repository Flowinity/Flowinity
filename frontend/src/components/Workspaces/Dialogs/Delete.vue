<template>
  <v-dialog
    max-width="600px"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-card-text>
          This item, and any of its children, will be permanently deleted.
          <br />
          This is irreversible.
        </v-card-text>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="$emit('update:modelValue', false)">
          Cancel
        </v-btn>
        <v-btn color="error" text @click="$emit('submit')" :loading="loading">
          {{ btnText ? btnText : "Delete" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "WorkspaceDeleteDialog",
  props: ["submit", "loading", "title", "btnText", "modelValue"],
  emits: ["update:modelValue", "submit"]
});
</script>

<style scoped></style>
