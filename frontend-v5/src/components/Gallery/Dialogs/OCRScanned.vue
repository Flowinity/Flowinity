<template>
  <tpu-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="500"
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
          color="blue"
          variant="passive"
          @click="
            $functions.copy(appStore.dialogs.gallery.ocr.content);
            toast.success('generic.copied');
          "
        >
          {{ t("gallery.dialogs.ocr.copyAll") }}
        </tpu-button>
      </card-actions>
    </template>
  </tpu-dialog>
</template>

<script setup lang="ts">
import TpuDialog from "@/components/Core/Dialog/TpuDialog.vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app.store";
import CardActions from "@/components/Core/Card/CardActions.vue";
import TpuButton from "@/components/Core/Button/TpuButton.vue";
import TextField from "@/components/Core/Input/TextField.vue";
import { useToast } from "vue-toastification";

const { t } = useI18n();
const props = defineProps({
  modelValue: Boolean
});
const appStore = useAppStore();
const toast = useToast();
</script>

<style scoped></style>
