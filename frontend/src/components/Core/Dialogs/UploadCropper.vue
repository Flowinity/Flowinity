<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="500"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>
      {{ title || "Upload" }}
    </template>
    <v-card-text>
      <v-file-input
        v-model="file"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
        label="Image File"
      ></v-file-input>
      <vue-cropper
        v-if="result"
        id="banner-editor"
        :key="key"
        ref="cropper"
        :aspectRatio="aspectRatio"
        :src="result"
        alt="banner"
      ></vue-cropper>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="
          $emit('update:modelValue', false);
          file = [];
        "
      >
        Cancel
      </v-btn>
      <v-btn color="primary" @click="save">Save</v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import VueCropper from "vue-cropperjs"
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue"

export default defineComponent({
  name: "UploadCropper",
  props: ["modelValue", "title", "aspectRatio"],
  emits: ["update:modelValue", "finish"],
  components: {CoreDialog, VueCropper},
  data() {
    return {
      file: [] as File[],
      result: undefined as string | undefined,
      loading: false,
      key: 0
    }
  },
  methods: {
    async fileReader() {
      const reader = new FileReader()
      reader.onload = () => {
        this.result = reader.result as string
        return this.result
      }
      await reader.readAsDataURL(this.file[0] as File)
    },
    async save() {
      if (!this.file.length) return
      // get the img in the banner-editor id div
      const file = this.$functions.base64ToFile(
        //@ts-ignore
        this.$refs.cropper.getCroppedCanvas().toDataURL("image/png"),
        "tpu-cropped.png"
      )
      this.loading = true
      await this.$emit("finish", file)
      this.$emit("update:modelValue", false)
      this.loading = false
    }
  },
  watch: {
    async file() {
      if (!this.file.length) return
      this.result = undefined
      await this.fileReader()
      this.key++
    }
  }
})
</script>

<style scoped></style>
