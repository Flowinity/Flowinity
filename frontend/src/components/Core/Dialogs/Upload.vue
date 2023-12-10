<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="500px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>Upload to TPU</template>
    <v-progress-linear
      v-if="$app.dialogs.upload.loading"
      :model-value="$app.dialogs.upload.percentage"
      color="primary"
      height="20"
    >
      <strong>{{ Math.ceil($app.dialogs.upload.percentage) }}%</strong>
    </v-progress-linear>
    <v-card-text>
      <v-file-input v-model="files" label="Upload File(s)" multiple />
      <small>
        Tip: {{ tip }}
        <router-link
          v-if="tip === 'Want to automate your file uploading?'"
          to="/settings/clients"
          @click="$emit('update:modelValue', false)"
        >
          Learn how
        </router-link>
      </small>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        :loading="$app.dialogs.upload.loading"
        color="primary"
        @click="upload"
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
  props: ["modelValue"],
  emits: ["update:modelValue", "upload"],
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
  mounted() {
    this.tip = this.tips[Math.floor(Math.random() * this.tips.length)];
  },
  methods: {
    async upload() {
      this.$app.dialogs.upload.files = this.files;
      await this.$app.upload();
    }
  }
});
</script>
