<template>
  <CoreDialog
    max-width="600px"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>
      {{ title }}
    </template>

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
      <v-btn color="error" @click="$emit('update:modelValue', false)">
        Cancel
      </v-btn>
      <v-btn color="primary" @click="$emit('submit', name)" :loading="loading">
        {{ btnText ? btnText : "Create" }}
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
export default defineComponent({
  name: "WorkspaceDialog",
  components: { CoreDialog },
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
