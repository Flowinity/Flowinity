<template>
  <CoreDialog
    :fullscreen="false"
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>
      {{ title }}
    </template>
    <v-container>
      <v-card-text>
        This item, and any of its children, will be permanently deleted.
        <br />
        This is irreversible.
      </v-card-text>
    </v-container>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="$emit('update:modelValue', false)">
        Cancel
      </v-btn>
      <v-btn :loading="loading" color="error" @click="$emit('submit')">
        {{ btnText ? btnText : "Delete" }}
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts" setup>
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

defineProps(["submit", "loading", "title", "btnText", "modelValue"]);
defineEmits(["update:modelValue", "submit"]);
</script>
