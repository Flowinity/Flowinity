<template>
  <v-dialog
    @update:modelValue="$emit('update:modelValue', $event)"
    :model-value="modelValue"
    max-width="800px"
    max-height="500px"
    :height="$chat.dialogs.image.object?.height * 2"
    :width="$chat.dialogs.image.object?.width * 2.5"
  >
    <v-card>
      <v-img
        :src="$chat.dialogs.image.object?.url"
        :aspect-ratio="
          $chat.dialogs.image.object?.width / $chat.dialogs.image.object?.height
        "
      ></v-img>
    </v-card>
    <a
      class="text-grey mt-2 pointer"
      @click="$chat.processLink($chat.dialogs.image.object?.originalURL)"
    >
      Open in new tab
    </a>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ColubrinaImageDialog",
  props: ["modelValue"],
  emits: ["update:modelValue"]
});
</script>

<style scoped></style>
