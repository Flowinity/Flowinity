<template>
  <tpu-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="500"
  >
    <template #toolbar>
      {{ t("gallery.dialogs.edit.title") }}
    </template>
    <template #default>
      <p class="my-4 mx-4">
        <text-field
          v-if="appStore.dialogs.gallery.edit.upload"
          v-model="uploadName"
          :label="$t('gallery.dialogs.edit.name')"
        />
      </p>
      <card-actions>
        <tpu-button color="blue" variant="passive" @click="updateUpload">
          {{ t("generic.save") }}
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
import TpuSelect from "@/components/Core/Input/TpuSelect.vue";
import { ref, watch } from "vue";
import { useCollectionsStore } from "@/stores/collections.store";
import axios from "@/plugins/axios";
import { useApolloClient } from "@vue/apollo-composable";
import {
  DeleteUploadMutation,
  UpdateUploadMutation
} from "@/graphql/gallery/gallery.graphql";
import { useToast } from "vue-toastification";

const { t } = useI18n();
const props = defineProps({
  modelValue: Boolean
});
const appStore = useAppStore();
const emit = defineEmits(["update:modelValue", "addToCollection"]);
const loading = ref(false);
const uploadName = ref("");

watch(
  () => appStore.dialogs.gallery.edit.upload?.name,
  (val) => {
    uploadName.value = val;
  }
);

async function updateUpload() {
  loading.value = true;
  try {
    await useApolloClient().client.mutate({
      mutation: UpdateUploadMutation,
      variables: {
        input: {
          uploadId: appStore.dialogs.gallery.edit.upload?.id,
          name: uploadName.value
        }
      }
    });
    appStore.dialogs.gallery.edit.upload = null;
    emit("update:modelValue", false);
    useToast().success("Successfully updated item.");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
