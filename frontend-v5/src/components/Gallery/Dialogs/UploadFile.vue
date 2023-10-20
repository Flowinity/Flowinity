<template>
  <tpu-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="500"
    @drop="drop"
    @dragover.prevent
  >
    <template #toolbar>
      {{
        t("gallery.dialogs.upload.title", {
          collection: collectionsStore.selected?.name || "your Gallery"
        })
      }}
    </template>
    <template #default>
      <div class="flex items-center justify-center w-full h-full">
        <label
          for="dropzone-file"
          class="flex flex-col w-full h-64 border-2 border-outline-dark border-dashed rounded-lg mx-3 my-3"
          :class="{
            'items-center justify-center cursor-pointer':
              !appStore.dialogs.gallery.upload.files.length,
            'cursor-normal': appStore.dialogs.gallery.upload.files.length
          }"
          @click="
            appStore.dialogs.gallery.upload.files.length
              ? $event.preventDefault()
              : () => {}
          "
        >
          <div class="flex flex-col justify-center pt-3 pb-3 h-full">
            <template v-if="!appStore.dialogs.gallery.upload.files.length">
              <RiUploadLine style="height: 50px" class="mb-2" />
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">
                  {{ t("gallery.dialogs.upload.clickToUpload") }}
                </span>
                {{ t("gallery.dialogs.upload.dragAndDrop") }}
              </p>
            </template>
            <template v-else>
              <div class="flex-col justify-between h-full">
                <div class="flex-col gap-2 mx-4">
                  <div
                    v-for="(file, index) in appStore.dialogs.gallery.upload
                      .files"
                    :key="file"
                    class="flex justify-between"
                  >
                    {{ file.name }}
                    <tpu-button
                      class="cursor-pointer"
                      variant="passive"
                      @click.prevent="
                        appStore.dialogs.gallery.upload.files.splice(index, 1)
                      "
                    >
                      <RiCloseLine style="width: 20px" />
                    </tpu-button>
                  </div>
                  <div v-if="false">
                    <tpu-button
                      class="cursor-pointer flex justify-center gap-2 mt-2"
                      variant="passive"
                      @click="clickInput"
                    >
                      <RiAddLine style="width: 20px" />
                      {{ t("gallery.dialogs.upload.addMore") }}
                    </tpu-button>
                  </div>
                </div>
              </div>
              <div class="flex justify-center mx-4">
                <tpu-progress-bar
                  :percentage="appStore.dialogs.gallery.upload.percentage"
                  v-if="appStore.dialogs.gallery.upload.loading"
                />
              </div>
            </template>
          </div>
          <input
            id="dropzone-file"
            ref="file"
            class="hidden"
            type="file"
            multiple
            v-on:change="
              appStore.dialogs.gallery.upload.files = Array.from(
                $event.target?.files
              )
            "
            :key="appStore.dialogs.gallery.upload.files"
          />
        </label>
      </div>
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
import RiUploadLine from "vue-remix-icons/icons/ri-upload-cloud-2-line.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import RiAddLine from "vue-remix-icons/icons/ri-add-line.vue";
import TpuProgressBar from "@/components/Core/Spinner/TpuProgressBar.vue";
import { useCollectionsStore } from "@/stores/collections.store";
const { t } = useI18n();
const props = defineProps({
  modelValue: {
    type: Object
  }
});
const appStore = useAppStore();
const collectionsStore = useCollectionsStore();

function drop(e: Event) {
  e.preventDefault();
  appStore.dialogs.gallery.upload.files.push(
    ...Array.from(e.dataTransfer.files)
  );
}

function clickInput() {
  document.getElementById("dropzone-file")?.click();
}
</script>

<style scoped></style>
