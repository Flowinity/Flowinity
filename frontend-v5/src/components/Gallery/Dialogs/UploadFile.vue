<template>
  <tpu-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="500"
  >
    <template #toolbar>
      {{ t("gallery.dialogs.upload.title") }}
    </template>
    <template #default>
      <p class="my-4 mx-4">
        <input
          type="file"
          v-on:change="
            appStore.dialogs.gallery.upload.files =
              $event.target.files || $event.dataTransfer.files
          "
        />
        {{ appStore.dialogs.gallery.upload.percentage }}% complete
      </p>
      <card-actions>
        <tpu-button
          color="blue"
          variant="passive"
          @click="appStore.upload()"
          :loading="appStore.dialogs.gallery.upload.loading"
          :disabled="!appStore.dialogs.gallery.upload.files.length"
        >
          {{ t("generic.upload") }}
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
import { ref } from "vue";
import { useCollectionsStore } from "@/stores/collections.store";
import axios from "@/plugins/axios";

const { t } = useI18n();
const props = defineProps({
  modelValue: Boolean
});
const appStore = useAppStore();
const collectionsStore = useCollectionsStore();
const emit = defineEmits(["update:modelValue", "addToCollection"]);
const loading = ref(false);
const upload = ref<File | null>(null);
</script>

<style scoped></style>
