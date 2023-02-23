<template>
  <v-dialog
    max-width="500px"
    @update:model-value="$emit('update:modelValue', $event)"
    :model-value="modelValue"
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Upload</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-file-input
          v-model="file"
          multiple
          label="Upload File"
        ></v-file-input>
        <v-card-actions class="mb-n5">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="$emit('upload', file)">Upload</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UploadDialog",
  emits: ["update:modelValue", "upload"],
  props: ["modelValue"],
  data() {
    return {
      file: undefined as File[] | undefined
    };
  }
});
</script>

<style scoped></style>
