<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="500px"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>You are leaving TPU</template>
    <v-card-text>
      <p>
        You are about to leave TPU and go to:
        <v-textarea
          :disabled="true"
          :model-value="$chat.dialogs.externalSite.url"
          auto-grow
          rows="1"
          variant="plain"
        />
        This link is not part of TPU and might be unsafe. Do you want to
        continue?
      </p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('update:modelValue', false)">Cancel</v-btn>
      <v-btn color="primary" @click="$chat.confirmLink(false)">Continue</v-btn>
    </v-card-actions>
    <small
      class="text-grey text-center mb-1 pointer"
      @click="$chat.confirmLink(true)"
    >
      Open & trust this domain in the future
    </small>
  </CoreDialog>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "URLConfirmDialog",
  components: {CoreDialog},
  props: ["modelValue"],
  emits: ["update:modelValue"]
});
</script>

<style scoped></style>
