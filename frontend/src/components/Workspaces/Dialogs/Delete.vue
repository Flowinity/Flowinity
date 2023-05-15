<template>
  <CoreDialog
    :fullscreen="false"
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>
      {{ title }}
    </template>
    <v-container>
      <v-card-text>
        This item, and any of its children, will be permanently deleted.
        <br/>
        This is irreversible.
      </v-card-text>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$emit('update:modelValue', false)">
        Cancel
      </v-btn>
      <v-btn :loading="loading" color="error" @click="$emit('submit')">
        {{ btnText ? btnText : "Delete" }}
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue"

export default defineComponent({
  name: "WorkspaceDeleteDialog",
  components: {CoreDialog},
  props: ["submit", "loading", "title", "btnText", "modelValue"],
  emits: ["update:modelValue", "submit"]
})
</script>

<style scoped></style>
