<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>
      {{ title }}
    </template>

    <v-container>
      <v-text-field
        v-model="name"
        :autofocus="true"
        label="Name"
        required
        @keyup.enter="$emit('submit', name)"
      />
    </v-container>
    <v-card-actions>
      <v-spacer />
      <v-btn color="error" @click="$emit('update:modelValue', false)">
        Cancel
      </v-btn>
      <v-btn :loading="loading" color="primary" @click="$emit('submit', name)">
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
