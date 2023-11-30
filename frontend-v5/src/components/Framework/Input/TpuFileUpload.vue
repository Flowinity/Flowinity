<template>
  <div
    class="flex items-center justify-center w-full h-full"
    @drop.prevent.stop="drop"
    @dragover.prevent.stop
  >
    <label
      for="dropzone-file"
      class="flex flex-col w-full h-64 border-2 border-outline-dark border-dashed rounded-lg mx-3 my-3"
      :class="{
        'items-center justify-center cursor-pointer': !files.length,
        'cursor-normal': files.length
      }"
      @click="files.length ? $event.preventDefault() : ''"
    >
      <div class="flex flex-col justify-center pt-3 pb-3 h-full">
        <template v-if="!files.length">
          <RiUploadLine style="height: 50px" class="mb-2" />
          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span class="font-semibold">
              {{ t("gallery.dialogs.upload.clickToUpload") }}
            </span>
            {{ t("gallery.dialogs.upload.dragAndDrop") }}
          </p>
        </template>
        <slot v-else name="after-select">
          <div class="flex-col justify-between h-full">
            <div class="flex-col gap-2 mx-4">
              <div
                v-for="(file, index) in files"
                :key="file.name + file.size"
                class="flex justify-between"
              >
                {{ file.name }}
                <tpu-button
                  class="cursor-pointer"
                  variant="passive"
                  @click.prevent="spliceFile(index)"
                >
                  <RiCloseLine style="width: 20px" />
                </tpu-button>
              </div>
            </div>
          </div>
          <div class="flex justify-center mx-4">
            <tpu-progress-bar v-if="loading" :percentage="percentage" />
          </div>
        </slot>
      </div>
      <input
        id="dropzone-file"
        ref="file"
        :key="files.map((file) => file.name).join(', ')"
        class="hidden"
        type="file"
        :multiple="props.multiple"
        :accept="accept"
        @change="$emit('update:files', Array.from($event.target?.files))"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
import RiUploadLine from "vue-remix-icons/icons/ri-upload-cloud-2-line.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import TpuProgressBar from "@/components/Framework/Spinner/TpuProgressBar.vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  files: {
    type: Object as () => File[],
    default: () => {
      return [];
    }
  },
  loading: Boolean,
  percentage: Number,
  multiple: {
    type: Boolean,
    default: true
  },
  accept: String
});

const { t } = useI18n();

const emit = defineEmits(["update:files"]);

function spliceFile(index: number) {
  if (index !== -1) {
    const files = props.files.slice();
    files.splice(index, 1);
    emit("update:files", files);
  }
}

function drop(e: Event) {
  e.preventDefault();
  if (!e.dataTransfer?.files?.length) return;
  emit("update:files", [...props.files, ...Array.from(e.dataTransfer.files)]);
}
</script>

<style scoped></style>
