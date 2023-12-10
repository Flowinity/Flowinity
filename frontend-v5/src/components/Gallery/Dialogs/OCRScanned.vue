<template>
  <tpu-dialog
    :model-value="modelValue"
    width="500"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #toolbar>
      {{ t("gallery.dialogs.ocr.title") }}
    </template>
    <template #default>
      <div class="my-4 mx-4">
        <small class="break-normal">
          {{ t("gallery.dialogs.ocr.tip") }}
        </small>
        <text-field
          :model-value="appStore.dialogs.gallery.ocr.content"
          :disabled="true"
          :textarea="true"
        />
      </div>
      <card-actions>
        <tpu-button
          variant="passive"
          @click="
            $functions.copy(appStore.dialogs.gallery.ocr.content);
            toast.success(t('generic.copied'));
          "
        >
          {{ t("gallery.dialogs.ocr.copyAll") }}
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
import TextField from "@/components/Framework/Input/TextField.vue";
import { useToast } from "vue-toastification";

const { t } = useI18n();
defineProps({
  modelValue: Boolean
});
defineEmits(["update:modelValue"]);
const appStore = useAppStore();
const toast = useToast();
</script>

<style scoped></style>
