<template>
  <tpu-dialog
    :model-value="modelValue"
    width="500"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #toolbar>
      {{ title || t("dialogs.uploadCropper.title") }}
    </template>
    <div class="relative">
      <tpu-file-upload
        v-model:files="files"
        :multiple="false"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
      >
        <template #after-select>
          <cropper
            v-if="image.src"
            ref="cropperRef"
            class="cropper"
            :src="image.src"
            :stencil-props="{
              minAspectRatio: aspectRatio,
              maxAspectRatio: aspectRatio,
              aspectRatio: aspectRatio
            }"
          />
        </template>
      </tpu-file-upload>
    </div>

    <card-actions :double="!!image.src">
      <template v-if="image.src" #start>
        <tpu-button
          class="gap-1"
          variant="passive"
          @click="
            files = [];
            revoke();
            image.src = '';
            image.type = '';
          "
        >
          <RiArrowLeftLine style="height: 20px" />
          {{ t("generic.back") }}
        </tpu-button>
      </template>
      <template v-if="image.src">
        <tpu-button
          variant="passive"
          :loading="loading"
          @click="$emit('setImage', files[0])"
        >
          {{ t("dialogs.uploadCropper.skipCrop") }}
        </tpu-button>
        <tpu-button variant="passive" :loading="loading" @click="save">
          {{ t("generic.save") }}
        </tpu-button>
      </template>
      <template v-else>
        <tpu-button
          variant="passive"
          @click="$emit('update:modelValue', false)"
        >
          {{ t("generic.cancel") }}
        </tpu-button>
      </template>
    </card-actions>
  </tpu-dialog>
</template>

<script setup lang="ts">
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import { useI18n } from "vue-i18n";
import TpuFileUpload from "@/components/Framework/Input/TpuFileUpload.vue";
import { onUnmounted, ref, watch } from "vue";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import CardActions from "@/components/Framework/Card/CardActions.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import functions from "@/plugins/functions";
import RiArrowLeftLine from "vue-remix-icons/icons/ri-arrow-left-line.vue";

const props = defineProps({
  modelValue: Boolean,
  title: String,
  aspectRatio: Number
});

const { t } = useI18n();
const files = ref<File[]>([]);
const image = ref<{ src: string; type: string }>({ src: "", type: "" });
const key = ref<number>(0);
const emit = defineEmits(["update:modelValue", "setImage"]);
const cropperRef = ref<InstanceType<typeof Cropper> | null>(null);
const loading = ref(false);

function revoke() {
  if (image.value.src) {
    URL.revokeObjectURL(image.value.src);
  }
}

function fileReader() {
  revoke();
  if (!files.value[0]) return;
  const blob = URL.createObjectURL(files.value[0]);

  const reader = new FileReader();
  reader.onload = () => {
    image.value = {
      src: blob,
      type: files.value[0].type
    };
  };
  reader.readAsArrayBuffer(files.value[0]);
}

async function save() {
  if (!files.value.length) return;
  if (files.value[0].type === "image/gif") {
    emit("setImage", files.value[0]);
    emit("update:modelValue", false);
    return;
  }
  // get the img in the banner-editor id div
  const crop = cropperRef.value?.getResult();
  crop?.canvas?.toBlob((blob) => {
    if (!blob) return;
    loading.value = true;
    emit("setImage", new File([blob], "tpu-cropped.png"), () => {
      emit("update:modelValue", false);
      loading.value = false;
      revoke();
      files.value = [];
      image.value.src = "";
      image.value.type = "";
    });
  });
}

watch(
  () => files.value,
  (val) => {
    fileReader();
    key.value++;
  }
);

onUnmounted(() => {
  if (image.value.src) {
    URL.revokeObjectURL(image.value.src);
  }
});
</script>

<style>
.cropper img,
.cropper .cropper-container {
}
</style>
