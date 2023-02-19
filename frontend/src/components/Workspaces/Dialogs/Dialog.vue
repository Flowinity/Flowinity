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
        <v-text-field
          label="Name"
          required
          autofocus
          v-model="name"
          @keyup.enter="$emit('submit', name)"
        ></v-text-field>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="$emit('update:modelValue', false)">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="$emit('submit', name)"
          :loading="loading"
        >
          {{ btnText ? btnText : "Create" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "WorkspaceDialog",
  props: ["submit", "loading", "title", "btnText", "modelValue"],
  emits: ["update:modelValue", "submit"],
  data() {
    return {
      name: ""
    };
  },
  watch: {
    modelValue: {
      handler() {
        this.name = "";
      },
      immediate: true
    }
  }
});
</script>

<style scoped></style>
