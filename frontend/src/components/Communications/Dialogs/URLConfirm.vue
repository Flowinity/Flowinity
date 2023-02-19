<template>
  <v-dialog
    @update:modelValue="$emit('update:modelValue', $event)"
    :model-value="modelValue"
    max-width="500px"
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title>You are leaving TPU.</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p>
          You are about to leave TPU and go to
          <strong>{{ domain }}.</strong>

          <br />
          <br />
          This link is not part of TPU and might be unsafe. Do you want to
          continue?
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('update:modelValue', false)">Cancel</v-btn>
        <v-btn @click="$chat.confirmLink(false)" color="primary">
          Continue
        </v-btn>
      </v-card-actions>
      <small
        class="text-grey text-center mb-1 pointer"
        @click="$chat.confirmLink(true)"
      >
        Open & trust this domain in the future
      </small>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "URLConfirmDialog",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  computed: {
    domain() {
      const url = new URL(this.$chat.dialogs.externalSite.url);
      return url.hostname;
    }
  }
});
</script>

<style scoped></style>
