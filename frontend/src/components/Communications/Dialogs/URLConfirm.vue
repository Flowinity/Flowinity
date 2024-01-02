<template>
  <CoreDialog
    :model-value="modelValue"
    style="max-width: 548px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>You are leaving TPU</template>
    <v-card-text>
      <p>
        You are about to leave TPU and go to:
        <v-textarea
          auto-grow
          rows="1"
          variant="plain"
          :disabled="true"
          :model-value="$chat.dialogs.externalSite.url"
        />
        This link is not part of TPU and might be unsafe. Do you want to
        continue?
      </p>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
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

<script lang="ts" setup>
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>
