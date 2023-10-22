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
        <tpu-button color="red" variant="passive" @click="deleteUploads">
          {{ t("generic.delete") }}
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
import { DeleteUploadMutation } from "@/graphql/gallery/gallery.graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { ref } from "vue";
import { useToast } from "vue-toastification";
import { useGalleryStore } from "@/stores/gallery.store";

const { t } = useI18n();
const props = defineProps({
  modelValue: Boolean
});
const appStore = useAppStore();
const emit = defineEmits(["update:modelValue"]);
const loading = ref(false);

async function deleteUploads() {
  loading.value = true;
  try {
    await useGalleryStore().deleteUploads(
      appStore.dialogs.gallery.delete.bulkIds.length
        ? appStore.dialogs.gallery.delete.bulkIds
        : [appStore.dialogs.gallery.delete.upload?.id]
    );
    appStore.dialogs.gallery.delete.bulkIds = [];
    appStore.dialogs.gallery.delete.upload = null;
    emit("update:modelValue", false);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
