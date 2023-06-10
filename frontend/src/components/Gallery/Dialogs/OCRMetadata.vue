<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600px"
    max-height="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>
      {{ $t("gallery.actions.ocr.title") }}
    </template>
    <v-card-text>
      <v-textarea
        class="mb-n4"
        :disabled="true"
        auto-grow
        variant="outlined"
        rows="1"
        :model-value="$app.dialogs.ocr.text"
      ></v-textarea>
      <small>
        {{ $t("gallery.actions.ocr.tip") }}
      </small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$emit('update:modelValue', false)">
        {{ $t("generic.close") }}
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "OCRMetadata",
  components: { CoreDialog },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      selectedCollection: null as number | null
    };
  },
  watch: {
    modelValue() {
      this.selectedCollection = null;
    }
  }
});
</script>

<style scoped></style>
