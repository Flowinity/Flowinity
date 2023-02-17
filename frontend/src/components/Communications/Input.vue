<template>
  <v-toolbar
    ref="toolbar"
    height="auto"
    :color="editing ? 'transparent' : undefined"
  >
    <v-textarea
      ref="textarea"
      class="mb-n5"
      label="Type a message..."
      placeholder="Keep it civil."
      variant="outlined"
      append-icon="mdi-send"
      @update:model-value="$emit('update:modelValue', $event)"
      :value="modelValue"
      density="comfortable"
      rows="1"
      auto-grow
      autofocus
      color="primary"
      @keydown.enter.exact.prevent="$emit('sendMessage')"
      @click:append="$emit('sendMessage')"
      :single-line="editing"
    >
      <template v-slot:prepend>
        <v-icon>mdi-plus-circle</v-icon>
      </template>
      <template v-slot:append-inner>
        <v-icon class="mr-2">mdi-star</v-icon>
        <v-icon>mdi-emoticon</v-icon>
      </template>
    </v-textarea>
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CommunicationsInput",
  props: ["modelValue", "editing"],
  emits: ["update:modelValue", "sendMessage"]
});
</script>

<style scoped></style>
