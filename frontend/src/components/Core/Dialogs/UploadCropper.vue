<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="500"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>
      {{ title || $t("dialogs.uploadCropper.title") }}
    </template>
    <v-card-text>
      <v-file-input
        v-model="file"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
        :label="$t('dialogs.uploadCropper.label')"
      ></v-file-input>
      <vue-cropper
        v-if="result && file[0]?.type !== 'image/gif'"
        id="banner-editor"
        :key="key"
        ref="cropper"
        :aspectRatio="parseInt(aspectRatio)"
        :src="result"
        alt="banner"
      ></vue-cropper>
      <p v-else-if="result">Cropping unsupported on GIFs.</p>
    </v-card-text>
    <v-card-actions>
      <v-btn
        v-if="result"
        @click="
          $emit('finish', file[0]);
          $emit('update:modelValue', false);
        "
      >
        Skip Crop
      </v-btn>
      <v-btn color="red" @click="$emit('remove')" v-if="supportsRemoval">
        {{ removeText || $t("dialogs.uploadCropper.removeProfile") }}
      </v-btn>
      <v-spacer />
      <v-btn
        @click="
          $emit('update:modelValue', false);
          file = [];
        "
      >
        {{ $t("generic.cancel") }}
      </v-btn>
      <v-btn color="primary" @click="save" :loading="loading">
        {{ $t("generic.save") }}
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VueCropper from "vue-cropperjs";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import "cropperjs/dist/cropper.css";

export default defineComponent({
  name: "UploadCropper",
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: undefined
    },
    aspectRatio: {
      type: String,
      default: undefined
    },
    removeText: {
      type: String,
      default: undefined
    },
    supportsRemoval: {
      type: Boolean,
      default: true
    }
  },
  emits: ["update:modelValue", "finish", "remove"],
  components: { CoreDialog, VueCropper },
  data() {
    return {
      file: [] as File[],
      result: undefined as string | undefined,
      loading: false,
      key: 0
    };
  },
  methods: {
    async fileReader() {
      const reader = new FileReader();
      reader.onload = () => {
        this.result = reader.result as string;
        return this.result;
      };
      await reader.readAsDataURL(this.file[0] as File);
    },
    async save() {
      if (!this.file.length) return;
      if (this.file[0].type === "image/gif") {
        this.$emit("finish", this.file[0]);
        this.$emit("update:modelValue", false);
        return;
      }
      // get the img in the banner-editor id div
      const file = this.$functions.base64ToFile(
        //@ts-ignore
        this.$refs.cropper.getCroppedCanvas().toDataURL("image/png"),
        "tpu-cropped.png"
      );
      this.loading = true;
      await this.$emit("finish", file);
      this.$emit("update:modelValue", false);
      this.loading = false;
    }
  },
  watch: {
    async file() {
      if (!this.file.length) return;
      this.result = undefined;
      await this.fileReader();
      this.key++;
    },
    modelValue() {
      this.file = [];
      this.result = undefined;
    }
  }
});
</script>
