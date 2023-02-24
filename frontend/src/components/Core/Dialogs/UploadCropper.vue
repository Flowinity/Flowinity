<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="500"
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title>{{ title || "Upload" }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-file-input
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
          label="Image File"
          v-model="file"
        ></v-file-input>
        <vue-cropper
          v-if="result"
          :key="key"
          ref="cropper"
          :src="result"
          alt="banner"
          :aspectRatio="aspectRatio"
          id="banner-editor"
        ></vue-cropper>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="
            $emit('update:modelValue', false);
            file = [];
          "
        >
          Cancel
        </v-btn>
        <v-btn color="primary" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VueCropper from "vue-cropperjs";

export default defineComponent({
  name: "UploadCropper",
  props: ["modelValue", "title", "aspectRatio"],
  emits: ["update:modelValue", "finish"],
  components: { VueCropper },
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
    }
  }
});
</script>

<style scoped></style>
