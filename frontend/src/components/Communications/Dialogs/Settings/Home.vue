<template>
  <overline position="center">
    {{ $t("chats.settings.home.name") }}
  </overline>
  <div class="d-flex text-center justify-center flex-auto">
    <div style="max-width: 350px">
      <v-card-title
        style="
          padding: 0 10px 0 10px !important;
          margin: 0 !important;
          white-space: initial;
        "
      >
        {{ $t("chats.settings.home.avatar") }}
      </v-card-title>
      <v-card-subtitle style="white-space: initial" class="mb-4">
        {{ $t("chats.settings.home.avatarDesc") }}
      </v-card-subtitle>
      <UserAvatar :chat="chat" :edit="true" size="128"></UserAvatar>
      <v-card-subtitle class="mt-2">
        {{ $t("chats.settings.home.clickToChange") }}
      </v-card-subtitle>
    </div>
    <v-divider vertical class="ml-2 mr-6"></v-divider>
    <div style="width: 400px">
      <v-card-title
        style="
          padding: 0 10px 0 10px !important;
          margin: 0 !important;
          white-space: initial;
        "
      >
        {{ $t("chats.settings.home.groupName") }}
      </v-card-title>
      <v-card-subtitle style="white-space: initial" class="mb-4">
        {{ $t("chats.settings.home.groupNameDesc") }}
      </v-card-subtitle>
      <v-text-field
        :label="$t('chats.settings.home.groupName')"
        v-model="$chat.dialogs.groupSettings.item.name"
      ></v-text-field>
      <v-btn
        block
        @click="$chat.saveSettings()"
        :loading="$chat.dialogs.groupSettings.loading"
      >
        Save
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Chat } from "@/gql/graphql";
import Overline from "@/components/Core/Typography/Overline.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  name: "ChatSettingsHome",
  components: { UserAvatar, Overline },
  props: {
    chat: {
      type: Object as () => Chat
    }
  }
});
</script>

<style scoped></style>
