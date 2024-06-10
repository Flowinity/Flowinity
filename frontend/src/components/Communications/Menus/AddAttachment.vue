<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    activator="parent"
    location="top"
  >
    <v-card
      :width="$vuetify.display.mobile ? undefined : 700"
      height="500"
      max-width="700"
    >
      <v-tabs v-model="tab" align-tabs="center">
        <v-tab value="upload">Upload</v-tab>
        <v-tab value="gallery">Gallery</v-tab>
        <v-tab value="starred">Starred</v-tab>
        <v-tab value="gif">GIFs</v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="upload">
            <v-file-input
              ref="uploadInput"
              hide-input
              multiple
              style="display: none"
              truncate-length="15"
              @update:model-value="
                $emit('fileUpload', $event);
                menu = false;
              "
            />
            <v-row
              align="center"
              class="d-flex flex-column"
              dense
              justify="center"
              style="cursor: pointer"
              @click="handleClick"
            >
              <v-icon size="60">mdi-cloud-upload</v-icon>
              <p>Drop your file(s) here, or click to select them.</p>
            </v-row>
          </v-window-item>

          <v-window-item value="gallery">
            <InlineGallery
              type="gallery"
              @click-item="
                $emit('quickTPULink', $event);
                menu = false;
              "
            />
          </v-window-item>
          <v-window-item value="starred">
            <InlineGallery
              type="starred"
              @click-item="
                $emit('quickTPULink', $event);
                menu = false;
              "
            />
          </v-window-item>
          <v-window-item value="gif">
            <InlineGallery
              type="tenor"
              @click-item="
                $emit('quickTPULink', $event);
                menu = false;
              "
            />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import InlineGallery from "@/components/Communications/InlineGallery.vue";

const emit = defineEmits(["fileUpload", "quickTPULink", "handleClick"]);

const tab = ref<string | null>(null);
const uploadInput = ref<HTMLInputElement | null>(null);
const menu = defineModel<boolean>();

function handleClick() {
  uploadInput.value?.click();
}
</script>

<style scoped></style>
