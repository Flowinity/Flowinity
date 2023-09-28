<template>
  <v-dialog
    :model-value="modelValue"
    :width="width"
    max-width="800px"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <v-card v-if="$chat.dialogs.image.object">
      <v-img
        max-height="500px"
        :width="width"
        :height="height"
        :src="$chat.dialogs.image.object?.url"
      ></v-img>
    </v-card>
    <a
      class="text-grey pointer v-card py-2 rounded-xl px-2 hover-shade"
      style="
        background: rgb(var(--v-theme-toolbar));
        position: absolute;
        bottom: 10px;
        right: 10px;
      "
      @click="
        $chat.processLink(
          $chat.dialogs.image.object?.originalURL ||
            `https://${$app.site.domain}${$chat.dialogs.image.object.url}`
        )
      "
    >
      <span>
        <v-icon size="18" class="mx-1">mdi-open-in-new</v-icon>
      </span>
    </a>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ColubrinaImageDialog",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  computed: {
    width() {
      if (!this.$chat.dialogs.image.object) return 0;
      return this.$chat.dialogs.image.object?.width * 2;
    },
    height() {
      if (!this.$chat.dialogs.image.object) return 0;
      return this.$chat.dialogs.image.object?.height * 2.5;
    }
  }
});
</script>

<style scoped></style>
