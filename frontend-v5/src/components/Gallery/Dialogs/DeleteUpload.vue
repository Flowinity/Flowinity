<template>
  <tpu-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #toolbar>
      {{
        t("gallery.dialogs.delete.title", {
          item: appStore.dialogs.gallery.delete.bulkIds.length
            ? appStore.dialogs.gallery.delete.bulkIds.length + " items"
            : appStore.dialogs.gallery.delete.upload?.name
        })
      }}
    </template>
    <template #default>
      <p class="my-4 mx-4">
        {{ t("gallery.dialogs.delete.description") }}
      </p>
      <card-actions>
        <tpu-button color="red" variant="passive">
          {{ t("generic.delete") }}
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

const { t } = useI18n();
const props = defineProps({
  modelValue: Boolean
});
const appStore = useAppStore();
defineEmits(["update:modelValue"]);
</script>

<style scoped></style>
