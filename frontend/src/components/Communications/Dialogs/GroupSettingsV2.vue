<template>
  <CoreDialog
    :model-value="modelValue"
    fullscreen
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <template v-slot:toolbar>
      <v-toolbar color="transparent">
        <v-spacer></v-spacer>
        <CreateChat
          v-slot="{ props }"
          v-model="add"
          type="add"
          @add="
            $chat.changeUsers($event, true, $chat.editingChat.association.id)
          "
        >
          <v-btn
            class="float-end mr-2"
            icon
            @click="add = true"
            v-bind="props"
            v-if="$chat.hasPermission('ADD_USERS', $chat.editingChat)"
          >
            <v-tooltip activator="parent" location="bottom">
              {{ $t("chats.settings.addUser") }}
            </v-tooltip>
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </CreateChat>

        <v-btn
          class="float-end"
          icon
          @click="$emit('update:modelValue', false)"
        >
          <v-tooltip activator="parent" location="bottom">
            {{ $t("generic.close") }}
          </v-tooltip>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
    </template>
    <UploadCropper
      v-model="groupIcon"
      @finish="uploadIcon"
      type="chatIcon"
      @remove="removeIcon"
      :remove-text="$t('dialogs.uploadCropper.removeGroup')"
    />
    <div class="d-flex flex-row mt-n4" v-if="$chat.editingChat">
      <v-tabs direction="vertical" v-model="tab" style="max-width: 220px">
        <overline>
          {{ $chat.editingChat.name }}
        </overline>
        <v-tab value="home">
          <v-icon class="mr-2">mdi-home</v-icon>
          {{ $t("chats.settings.tabs.home") }}
        </v-tab>
        <v-tab
          value="ranks"
          v-if="$chat.hasPermission('MANAGE_RANKS', $chat.editingChat)"
        >
          <v-icon class="mr-2">mdi-lock</v-icon>
          {{ $t("chats.settings.tabs.ranks") }}
        </v-tab>
        <v-tab
          value="users"
          v-if="$chat.hasPermission('MANAGE_USERS', $chat.editingChat)"
        >
          <v-icon class="mr-2">mdi-account-group</v-icon>
          {{ $t("chats.settings.tabs.users") }}
        </v-tab>
        <v-tab
          value="invites"
          v-if="$chat.hasPermission('MANAGE_USERS', $chat.editingChat)"
        >
          <v-icon class="mr-2">mdi-account-plus</v-icon>
          {{ $t("chats.settings.tabs.invites") }}
        </v-tab>
        <v-tab
          value="emoji"
          v-if="$chat.hasPermission('CREATE_EMOJI', $chat.editingChat)"
        >
          <v-icon class="mr-2">mdi-emoticon</v-icon>
          {{ $t("chats.settings.tabs.emoji") }}
        </v-tab>
        <v-tab
          value="audit"
          v-if="$chat.hasPermission('VIEW_AUDIT_LOG', $chat.editingChat)"
        >
          <v-icon class="mr-2">mdi-note-search</v-icon>
          {{ $t("chats.settings.tabs.audit") }}
        </v-tab>
        <v-tab
          value="bots"
          v-if="$chat.hasPermission('MANAGE_INTEGRATIONS', $chat.editingChat)"
        >
          <v-icon class="mr-2">mdi-robot</v-icon>
          {{ $t("chats.settings.tabs.bots") }}
        </v-tab>
        <v-tab
          value="bans"
          v-if="$chat.hasPermission('BAN_USERS', $chat.editingChat)"
        >
          <v-icon class="mr-2">mdi-gavel</v-icon>
          {{ $t("chats.settings.tabs.bans") }}
        </v-tab>
        <v-divider class="my-2"></v-divider>
        <v-btn
          class="text-left"
          value="delete"
          v-if="$chat.editingChat.userId === $user.user.id"
          style="color: rgb(var(--v-theme-error)"
          @click.prevent="
            $chat.dialogs.leave.itemId = $chat.editingChat.id;
            $chat.dialogs.leave.value = true;
          "
        >
          <v-icon class="mr-2">mdi-delete</v-icon>
          {{ $t("chats.leave.delete.title") }}
        </v-btn>
      </v-tabs>
      <div style="width: 100%">
        <div v-show="tab === 'home'">
          <ChatSettingsHome />
        </div>
        <div v-show="tab === 'ranks'">
          <ChatSettingsRanks />
        </div>
        <div v-show="tab === 'users'">
          <ChatSettingsUsers />
        </div>
        <div v-show="tab === 'invites'">
          <ChatSettingsInvites :active="tab === 'invites'" />
        </div>
        <div v-show="tab === 'emoji'">
          <ChatSettingsEmoji />
        </div>
        <div v-show="tab === 'audit'">
          <ChatSettingsAudit :active="tab === 'audit'" />
        </div>
      </div>
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
import ChatSettingsRanks from "@/components/Communications/Dialogs/Settings/Ranks.vue";
import ChatSettingsUsers from "@/components/Communications/Dialogs/Settings/Users.vue";
import { AddChatUserMutation } from "@/graphql/chats/addUser.graphql";
import { ToggleUser } from "@/gql/graphql";
import ChatSettingsInvites from "@/components/Communications/Dialogs/Settings/Invites.vue";
import ChatSettingsEmoji from "@/components/Communications/Dialogs/Settings/Emoji.vue";
import ChatSettingsAudit from "@/components/Communications/Dialogs/Settings/Audit.vue";

export default defineComponent({
  name: "ColubrinaGroupSettingsDialog",
  components: {
    ChatSettingsAudit,
    ChatSettingsEmoji,
    ChatSettingsInvites,
    ChatSettingsUsers,
    ChatSettingsRanks,
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
  methods: {
    async uploadIcon(file: File) {
      if (this.$chat.editingChat) {
        this.groupIconLoading = true;
        const formData = new FormData();
        formData.append("icon", file);
        await this.axios.post(
          `/chats/${this.$chat.editingChat.association?.id}/icon`,
          formData
        );
        this.groupIcon = false;
        this.groupIconLoading = false;
      }
    },
    async removeIcon() {
      if (this.$chat.editingChat) {
        await this.axios.delete(
          `/chats/${this.$chat.editingChat.association?.id}/icon`
        );
      }
    },
    async changeRank(id: number, rank: string) {
      await this.axios.put(
        `/chats/${this.$chat.editingChat?.association?.id}/users/${id}`,
        {
          rank
        }
      );
    },
    async removeUser(id: number) {
      await this.axios.delete(
        `/chats/${this.$chat.editingChat?.association?.id}/users/${id}`
      );
      if (this.$chat.editingChat)
        this.$chat.editingChat.users.splice(
          this.$chat.editingChat.users.findIndex((user) => user.id === id),
          1
        );
    }
  }
});
</script>
