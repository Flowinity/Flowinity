<template>
  <CoreDialog
    :model-value="modelValue"
    width="500"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>
      {{
        $t("gallery.dialogs.upload.title", {
          collection: $collections.selected?.name || "your Gallery"
        })
      }}
    </template>
    <template #default>
      <tpu-file-upload
        v-model:files="$app.dialogs.upload.files"
        v-model:loading="$app.dialogs.upload.loading"
        v-model:percentage="$app.dialogs.upload.percentage"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn
          :loading="$app.dialogs.upload.loading"
          :disabled="!$app.dialogs.upload.files.length"
          @click="$app.upload()"
        >
          {{ $t("generic.upload") }}
        </v-btn>
      </v-card-actions>
    </template>
  </CoreDialog>
</template>

<script setup lang="ts">
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import TpuFileUpload from "@/components/Framework/Input/TpuFileUpload.vue";

const props = defineProps({
  modelValue: {
    type: Boolean
  }
});

defineEmits(["update:modelValue"]);
</script>

<style scoped></style>
