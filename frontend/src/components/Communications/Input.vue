<template>
  <v-toolbar
    ref="toolbar"
    height="auto"
    :color="editing ? 'transparent' : undefined"
  >
    <v-textarea
      ref="textarea"
      :class="!editing ? 'mb-n3 mt-2' : 'mt-2'"
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
      @keyup.esc="$emit('edit', null)"
    >
      <template v-slot:prepend v-if="!editing">
        <v-icon>mdi-plus-circle</v-icon>
      </template>
      <template v-slot:append-inner>
        <v-icon class="mr-2" v-if="!editing">mdi-star</v-icon>
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
  emits: ["update:modelValue", "sendMessage", "edit"]
});
</script>

<style scoped></style>