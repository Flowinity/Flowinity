<template>
  <UploadCropper
    v-model="upload"
    @finish="uploadIcon"
    type="chatIcon"
    :supports-removal="false"
  />
  <overline position="center">
    {{ $t("chats.settings.emoji.name") }}
  </overline>
  <div class="text-center">
    <v-btn @click="upload = true">Add Emoji</v-btn>
    <v-list v-for="emoji in emojis" :key="emoji.id">
      <v-avatar><v-img cover :src="$app.domain + emoji.icon"></v-img></v-avatar>
      {{ emoji.name }}
    </v-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Overline from "@/components/Core/Typography/Overline.vue";
import UploadCropper from "@/components/Core/Dialogs/UploadCropper.vue";

export default defineComponent({
  name: "ChatSettingsEmoji",
  components: { UploadCropper, Overline },
  data() {
    return {
      upload: false
    };
  },
  computed: {
    emojis() {
      return this.$chat.emoji.filter(
        (emoji) => emoji.chatId === this.$chat.editingChat.id
      );
    }
  },
  methods: {
    async uploadIcon(file: File) {
      if (this.$chat.editingChat) {
        const formData = new FormData();
        formData.append("icon", file);
        await this.axios.post(
          `/chats/${this.$chat.editingChat.association?.id}/icon?type=emoji`,
          formData
        );
        this.upload = false;
      }
    }
  }
});
</script>

<style scoped></style>
