<template>
  <v-toolbar
    ref="toolbar"
    height="auto"
    :color="editing ? 'transparent' : 'dark'"
  >
    <v-textarea
      ref="textarea"
      :class="!editing ? 'mb-n5 mt-1' : 'mt-2'"
      label="Type a message..."
      placeholder="Keep it civil."
      variant="outlined"
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
    >
      <template v-slot:prepend v-if="!editing">
        <HoverChip icon="mdi-plus" text="Attachment" :old="true"></HoverChip>
      </template>
      <template v-slot:append-inner>
        <HoverChip icon="mdi-star" text="Star" :old="true"></HoverChip>
        <HoverChip
          icon="mdi-emoticon"
          text="Emoji Picker"
          :old="true"
        ></HoverChip>
      </template>
      <template v-slot:append>
        <HoverChip icon="mdi-send" text="Send" :old="true"></HoverChip>
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
