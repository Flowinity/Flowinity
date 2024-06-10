<template>
  <div
    class="flex items-center justify-center w-full h-full px-3"
    @drop.prevent.stop="drop"
    @dragover.prevent.stop
  >
    <label
      for="dropzone-file"
      class="flex flex-col w-full h-64 border-2 border-outline-dark border-dashed rounded-lg px-3 my-3 cursor-pointer"
    >
      <div
        class="flex flex-col justify-center pt-3 pb-3 h-full w-full items-center text-center"
      >
        <template v-if="!files.length">
          <RiUploadCloud2Line size="50" class="mb-2" />
          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span class="font-semibold">
              {{ $t("gallery.dialogs.upload.clickToUpload") }}
            </span>
            {{ $t("gallery.dialogs.upload.dragAndDrop") }}
          </p>
        </template>
        <slot v-else name="after-select">
          <div class="flex-col justify-between h-full w-full">
            <div class="flex-col gap-2 w-full">
              <div
                v-for="(file, index) in files"
                :key="file.name + file.size"
                class="flex justify-between items-center w-full"
              >
                <span class="truncate pr-2">{{ file.name }}</span>
                <v-btn
                  size="x-small"
                  icon
                  @click.prevent.stop="spliceFile(index)"
                  class="flex-shrink-0 ml-2"
                >
                  <RiCloseLine style="width: 20px" />
                </v-btn>
              </div>
            </div>
          </div>
          <div class="flex justify-center mx-4">
            <v-progress-linear v-if="loading" :model-value="percentage" />
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
        @change="handleFileChange"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
import {
  RiCloseLine,
  RiUploadCloud2Fill,
  RiUploadCloud2Line,
  RiUploadLine
} from "@remixicon/vue";

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

function handleFileChange(e: Event) {
  e.preventDefault();
  emit("update:files", [...props.files, ...Array.from(e.target?.files)]);
}
</script>

<style scoped></style>
