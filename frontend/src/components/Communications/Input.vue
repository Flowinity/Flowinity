<template>
  <v-toolbar ref="toolbar" height="auto" style="z-index: 1001" color="bg">
    <v-textarea
      ref="textarea"
      :class="!editing ? 'mb-n5 mt-1' : 'mt-2'"
      label="Type a message..."
      placeholder="Keep it civil"
      variant="outlined"
      append-icon="mdi-send"
      @update:model-value="$emit('update:modelValue', $event)"
      :value="modelValue"
      density="compact"
      rows="1"
      auto-grow
      autofocus
      color="primary"
      @keydown.enter.exact.prevent="$emit('sendMessage')"
      @click:append="$emit('sendMessage')"
      @keyup.esc="$emit('edit', null)"
      :key="renderKey"
    >
      <template v-slot:prepend v-if="!editing">
        <v-icon>mdi-plus-circle</v-icon>
      </template>
      <template v-slot:append-inner>
        <v-icon class="mr-2" v-if="!editing">mdi-star</v-icon>
        <v-icon>mdi-emoticon</v-icon>
      </template>
      <template v-slot:details v-if="!editing">
        <span class="details-container">
          {{ $chat.typers }}
        </span>
      </template>
    </v-textarea>
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CommunicationsInput",
  props: ["modelValue", "editing", "renderKey"],
  emits: ["update:modelValue", "sendMessage", "edit"]
});
</script>

<style>
.details-container {
  align-items: flex-start !important;
  justify-content: flex-start !important;
  display: flex;
  width: 100%;
  height: 25px;
}
</style>
