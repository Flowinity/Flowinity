<template>
  <CoreDialog
    max-width="500px"
    @update:model-value="$emit('update:modelValue', $event)"
    :model-value="modelValue"
  >
    <template v-slot:title>Upload to TPU</template>
    <v-progress-linear
      :model-value="$app.dialogs.upload.percentage"
      height="20"
      color="primary"
      v-if="$app.dialogs.upload.loading"
    >
      <strong>{{ Math.ceil($app.dialogs.upload.percentage) }}%</strong>
    </v-progress-linear>
    <v-card-text>
      <v-file-input
        v-model="files"
        multiple
        label="Upload File(s)"
      ></v-file-input>
      <small>
        Tip: {{ tip }}
        <router-link
          to="/settings/clients"
          v-if="tip === 'Want to automate your file uploading?'"
          @click="$emit('update:modelValue', false)"
        >
          Learn how
        </router-link>
      </small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="upload"
        :loading="$app.dialogs.upload.loading"
      >
        Upload
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "UploadDialog",
  components: { CoreDialog },
  emits: ["update:modelValue", "upload"],
  props: ["modelValue"],
  data() {
    return {
      files: [] as File[],
      tips: [
        "You can paste files from your clipboard anywhere inside of TPU to upload it quickly.",
        "Want to automate your file uploading?"
      ],
      tip: ""
    };
  },
  methods: {
    async upload() {
      this.$app.dialogs.upload.files = this.files;
      await this.$app.upload();
    }
  },
  mounted() {
    this.tip = this.tips[Math.floor(Math.random() * this.tips.length)];
  }
});
</script>

<style scoped></style>
