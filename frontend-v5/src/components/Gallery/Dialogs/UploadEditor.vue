<template>
  <tpu-dialog
    :model-value="modelValue"
    :width="editor ? 800 : 500"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #toolbar>
      {{ t("gallery.dialogs.edit.title") }}
    </template>
    <template v-if="!editor" #default>
      <transition
        v-if="!editor"
        name="scroll-x-transition"
        mode="out-in"
        appear
      >
        <div>
          <p class="my-4 mx-4">
            <text-field
              v-if="appStore.dialogs.gallery.edit.upload"
              v-model="uploadName"
              :label="$t('gallery.dialogs.edit.name')"
              autofocus
            />
          </p>
          <card-actions>
            <tpu-button
              v-if="appStore.dialogs.gallery.edit.upload?.type === 'image'"
              color="purple"
              @click="editor = true"
            >
              {{ t("generic.edit") }}
            </tpu-button>
            <tpu-button variant="passive" @click="updateUpload">
              {{ t("generic.save") }}
            </tpu-button>
          </card-actions>
        </div>
      </transition>
    </template>
    <template v-else #default>
      <transition
        v-if="editor"
        name="scroll-x-reverse-transition"
        mode="out-in"
        appear
      >
        <GalleryEditor
          :name="appStore.dialogs.gallery.edit.upload!.name"
          :image="
            appStore.domain + appStore.dialogs.gallery.edit.upload?.attachment
          "
          @back="editor = false"
        />
      </transition>
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
import TpuSelect from "@/components/Framework/Input/TpuSelect.vue";
import { ref, watch } from "vue";
import { useCollectionsStore } from "@/stores/collections.store";
import axios from "@/plugins/axios";
import { useApolloClient } from "@vue/apollo-composable";
import {
  DeleteUploadMutation,
  UpdateUploadMutation
} from "@/graphql/gallery/gallery.graphql";
import { useToast } from "vue-toastification";
import GalleryEditor from "@/components/Gallery/GalleryEditor.vue";

const { t } = useI18n();
const props = defineProps({
  modelValue: Boolean
});
const appStore = useAppStore();
const emit = defineEmits(["update:modelValue", "addToCollection"]);
const loading = ref(false);
const uploadName = ref("");
const editor = ref(false);

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
