<template>
  <v-toolbar
    ref="toolbar"
    :color="editing ? 'transparent' : 'dark'"
    height="auto"
  >
    <v-textarea
      ref="textarea"
      :class="!editing ? 'mb-n5 mt-1' : 'mt-2'"
      :value="modelValue"
      auto-grow
      autofocus
      color="primary"
      density="compact"
      label="Type a message..."
      placeholder="Keep it civil."
      rows="1"
      variant="outlined"
      @update:model-value="$emit('update:modelValue', $event)"
      @keydown.enter.exact.prevent="$emit('sendMessage')"
      @click:append="$emit('sendMessage')"
      @keyup.esc="$emit('edit', null)"
    >
      <template v-if="!editing" v-slot:prepend>
        <HoverChip :old="true" icon="mdi-plus" text="Attachment"></HoverChip>
      </template>
      <template v-slot:append-inner>
        <HoverChip :old="true" icon="mdi-star" text="Star"></HoverChip>
        <HoverChip
          :old="true"
          icon="mdi-emoticon"
          text="Emoji Picker"
        ></HoverChip>
      </template>
      <template v-slot:append>
        <HoverChip :old="true" icon="mdi-send" text="Send"></HoverChip>
      </template>
    </v-textarea>
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HoverChip from "@/components/Core/HoverChip.vue";

export default defineComponent({
  name: "CommunicationsInput",
  components: { HoverChip },
  props: ["modelValue", "editing"],
  emits: ["update:modelValue", "sendMessage", "edit"]
});
</script>

<style scoped></style>
