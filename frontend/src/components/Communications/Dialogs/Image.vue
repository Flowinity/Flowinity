<template>
  <v-dialog
    :height="height"
    :model-value="modelValue"
    :width="width"
    max-height="500px"
    max-width="800px"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <v-card v-if="$chat.dialogs.image.object">
      <v-img
        :aspect-ratio="
          $chat.dialogs.image.object?.width / $chat.dialogs.image.object?.height
        "
        :src="$chat.dialogs.image.object?.url"
      ></v-img>
    </v-card>
    <a
      class="text-grey mt-2 pointer underline-on-hover"
      style="width: 130px"
      @click="$chat.processLink($chat.dialogs.image.object?.originalURL || '')"
    >
      Open in new tab
    </a>
  </v-dialog>
</template>

<script lang="ts">
import {defineComponent} from "vue"

export default defineComponent({
  name: "ColubrinaImageDialog",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  computed: {
    width() {
      if (!this.$chat.dialogs.image.object) return 0
      return this.$chat.dialogs.image.object?.width * 2
    },
    height() {
      if (!this.$chat.dialogs.image.object) return 0
      return this.$chat.dialogs.image.object?.height * 2.5
    }
  }
})
</script>

<style scoped></style>
