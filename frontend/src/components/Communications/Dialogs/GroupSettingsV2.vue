<template>
  <CoreDialog
    :model-value="modelValue"
    fullscreen
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>
      {{ $t("chats.settings.title") }}
    </template>
    <UploadCropper
      v-model="groupIcon"
      @finish="uploadIcon"
      type="chatIcon"
      @remove="removeIcon"
      :remove-text="$t('dialogs.uploadCropper.removeGroup')"
    />
    <div class="d-flex flex-row">
      <v-tabs direction="vertical" v-model="tab">
        <overline>
          {{ $chat.dialogs.groupSettings.item.name }}
        </overline>
        <v-tab value="home">
          <v-icon class="mr-2">mdi-home</v-icon>
          {{ $t("chats.settings.tabs.home") }}
        </v-tab>
        <v-tab value="ranks">
          <v-icon class="mr-2">mdi-lock</v-icon>
          {{ $t("chats.settings.tabs.ranks") }}
        </v-tab>
        <v-tab value="users">
          <v-icon class="mr-2">mdi-account-group</v-icon>
          {{ $t("chats.settings.tabs.users") }}
        </v-tab>
        <v-tab value="invites">
          <v-icon class="mr-2">mdi-account-plus</v-icon>
          {{ $t("chats.settings.tabs.invites") }}
        </v-tab>
        <v-tab value="bots">
          <v-icon class="mr-2">mdi-robot</v-icon>
          {{ $t("chats.settings.tabs.bots") }}
        </v-tab>
        <v-tab value="bans">
          <v-icon class="mr-2">mdi-gavel</v-icon>
          {{ $t("chats.settings.tabs.bans") }}
        </v-tab>
      </v-tabs>
      <v-window v-model="tab" class="flex-grow-1">
        <v-window-item value="home">
          <ChatSettingsHome :chat="$chat.dialogs.groupSettings.item" />
        </v-window-item>
        <v-window-item value="ranks">
          <ChatSettingsHome :chat="$chat.dialogs.groupSettings.item" />
        </v-window-item>
      </v-window>
    </div>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import CreateChat from "@/components/Communications/Menus/CreateChat.vue";
import UploadCropper from "@/components/Core/Dialogs/UploadCropper.vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import ChatSettingsHome from "@/components/Communications/Dialogs/Settings/Home.vue";
import Overline from "@/components/Core/Typography/Overline.vue";

export default defineComponent({
  name: "ColubrinaGroupSettingsDialog",
  components: {
    Overline,
    ChatSettingsHome,
    CoreDialog,
    UploadCropper,
    CreateChat,
    UserAvatar
  },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      icon: undefined as File[] | undefined,
      add: false,
      groupIcon: false,
      groupIconLoading: false,
      tab: "home"
    };
  },
  computed: {
    ranks() {
      let ranks = [
        {
          text: "Owner",
          value: "owner",
          props: { disabled: true }
        },
        {
          text: "Admin",
          value: "admin",
          props: { disabled: false }
        },
        {
          text: "Member",
          value: "member",
          props: { disabled: false }
        }
      ];
      if (
        this.$chat.dialogs.groupSettings.item?.association?.rank === "owner"
      ) {
        ranks[0].props.disabled = false;
      }
      return ranks;
    }
  },
  methods: {
    async uploadIcon(file: File) {
      if (this.$chat.dialogs.groupSettings.item) {
        this.groupIconLoading = true;
        const formData = new FormData();
        formData.append("icon", file);
        await this.axios.post(
          `/chats/${this.$chat.dialogs.groupSettings.item.association?.id}/icon`,
          formData
        );
        this.groupIcon = false;
        this.groupIconLoading = false;
      }
    },
    async removeIcon() {
      if (this.$chat.dialogs.groupSettings.item) {
        await this.axios.delete(
          `/chats/${this.$chat.dialogs.groupSettings.item.association?.id}/icon`
        );
      }
    },
    async changeRank(id: number, rank: string) {
      await this.axios.put(
        `/chats/${this.$chat.dialogs.groupSettings.item?.association?.id}/users/${id}`,
        {
          rank
        }
      );
    },
    async removeUser(id: number) {
      await this.axios.delete(
        `/chats/${this.$chat.dialogs.groupSettings.item?.association?.id}/users/${id}`
      );
      if (this.$chat.dialogs.groupSettings.item)
        this.$chat.dialogs.groupSettings.item.users.splice(
          this.$chat.dialogs.groupSettings.item.users.findIndex(
            (user) => user.id === id
          ),
          1
        );
    },
    async addUsers(users: number[]) {
      await this.axios.post(
        `/chats/${this.$chat.dialogs.groupSettings.item?.association?.id}/users`,
        {
          users
        }
      );
    }
  }
});
</script>
