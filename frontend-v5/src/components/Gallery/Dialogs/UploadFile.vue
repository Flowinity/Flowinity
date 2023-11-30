<template>
  <tpu-dialog
    :model-value="modelValue"
    width="500"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #toolbar>
      {{
        t("gallery.dialogs.upload.title", {
          collection: collectionsStore.selected?.name || "your Gallery"
        })
      }}
    </template>
    <template #default>
      <tpu-file-upload
        v-model:files="appStore.dialogs.gallery.upload.files"
        v-model:loading="appStore.dialogs.gallery.upload.loading"
        v-model:percentage="appStore.dialogs.gallery.upload.percentage"
      />
      <card-actions>
        <tpu-button
          variant="passive"
          :loading="appStore.dialogs.gallery.upload.loading"
          :disabled="!appStore.dialogs.gallery.upload.files.length"
          @click="appStore.upload()"
        >
          {{ t("generic.upload") }}
        </tpu-button>
      </card-actions>
    </template>
  </tpu-dialog>
</template>

<script setup lang="ts">
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app.store";
import CardActions from "@/components/Framework/Card/CardActions.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { useCollectionsStore } from "@/stores/collections.store";
import TpuFileUpload from "@/components/Framework/Input/TpuFileUpload.vue";
const { t } = useI18n();
const props = defineProps({
  modelValue: {
    type: Boolean
  }
});
const appStore = useAppStore();
const collectionsStore = useCollectionsStore();
</script>

<style scoped></style>
