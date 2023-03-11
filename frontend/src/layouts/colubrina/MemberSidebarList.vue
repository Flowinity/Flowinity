<template>
  <v-card-text
    v-if="!$chat.communicationsSidebar && !$vuetify.display.mobile"
    @click="$app.forcedWorkspaceDrawer = true"
    style="color: #0190ea; cursor: pointer; font-size: 12px"
  >
    <v-icon>mdi-arrow-left</v-icon>
    Back to Workspaces
  </v-card-text>
  <div class="mt-2" v-if="$vuetify.display.mobile">
    <CommunicationsAvatar
      :user="$chat.selectedChat?.recipient"
      :chat="$chat.selectedChat?.recipient ? null : $chat.selectedChat"
      size="32"
      class="ml-4"
      :status="true"
      style="display: inline-block"
    />
    <h4
      class="unselectable ml-2 limit"
      id="tpu-brand-logo"
      title="TPU Communications"
      style="display: inline-block; align-self: center; text-align: center"
    >
      {{ $chat.chatName }}
    </h4>
    <v-card-actions v-if="$chat.selectedChat">
      <v-spacer></v-spacer>
      <v-btn
        v-if="$experiments.experiments.PINNED_MESSAGES"
        icon
        class="mr-2"
        aria-label="Toggle Communications Sidebar"
      >
        <v-icon>mdi-pin</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="$chat.search.value = !$chat.search.value"
        class="mr-2"
        aria-label="Toggle Communications Search"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="
          $chat.dialogs.groupSettings.value = true;
          $chat.selectedChat
            ? ($chat.dialogs.groupSettings.item = $chat.selectedChat)
            : () => {};
        "
        class="mr-2"
        aria-label="Toggle Communications Settings"
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </div>
  <template v-if="!$chat.search.value">
    <v-card-text class="text-overline my-n3">MEMBERS</v-card-text>
    <v-list nav v-if="users">
      <v-list-item
        v-for="association in users"
        :subtitle="association.legacyUser ? 'Legacy User' : undefined"
        @click="
          $chat.dialogs.user.username = association.user?.username;
          $chat.dialogs.user.value = true;
        "
        @contextmenu.prevent="context($event, association)"
      >
        <template v-slot:title>
          {{ association.user?.username || "Deleted User" }}
          <span>
            <v-icon color="gold" v-if="association.rank === 'owner'">
              mdi-crown
            </v-icon>
            <v-tooltip location="top" activator="parent">Group Owner</v-tooltip>
          </span>
          <span>
            <v-icon color="grey" v-if="association.rank === 'admin'">
              mdi-crown
            </v-icon>
            <v-tooltip location="top" activator="parent">Group Admin</v-tooltip>
          </span>
        </template>
        <template v-slot:prepend>
          <CommunicationsAvatar
            :status="!!association.tpuUser"
            :user="association.user"
          ></CommunicationsAvatar>
        </template>
      </v-list-item>
      <v-list-item v-if="!$chat.chats.length" class="fade-skeleton">
        <MessageSkeleton :animate="false" v-for="i in 5"></MessageSkeleton>
      </v-list-item>
    </v-list>
  </template>
  <template v-else>
    <v-card-text class="text-overline my-n3">
      SEARCH
      <v-progress-circular
        v-if="$chat.search.loading"
        indeterminate
        size="16"
        width="2"
      ></v-progress-circular>
      <template v-else>({{ $chat.search.results.pager.totalItems }})</template>
    </v-card-text>
    <v-container class="mt-n8">
      <v-text-field
        v-model="$chat.search.query"
        autofocus
        label="Search Query"
        append-icon="mdi-magnify"
        @click:append="$chat.doSearch"
        @keyup.enter="$chat.doSearch"
      ></v-text-field>
    </v-container>
    <v-list v-if="!$chat.search.loading">
      <Message
        class="pointer"
        @click="
          handleJump(
            message.id,
            $chat.chats.find((chat) => chat.id === message.chatId)?.association
              .id || 0
          )
        "
        v-for="(message, index) in $chat.search.results.messages"
        :key="message.id"
        :message="message"
        :id="'message-' + index"
        @authorClick="
          $chat.dialogs.userMenu.value = false;
          $chat.dialogs.userMenu.user = $event.user;
          $chat.dialogs.userMenu.username = $event.user.username;
          $chat.dialogs.userMenu.bindingElement = $event.bindingElement;
          $chat.dialogs.userMenu.x = $event.x;
          $chat.dialogs.userMenu.y = $event.y;
          $chat.dialogs.userMenu.location = $event.location || 'top';
          $chat.dialogs.userMenu.value = true;
        "
        @jumpToMessage="
          handleJump(
            $event,
            $chat.chats.find((chat) => chat.id === message.chatId)?.association
              .id || 0
          )
        "
        :search="true"
      />
    </v-list>
    <Paginate
      v-model="$chat.search.results.pager.currentPage"
      @update:model-value="$chat.doSearch"
      :total-pages="$chat.search.results.pager.totalPages"
      :max-visible="5"
      class="mb-2"
    ></Paginate>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Chat } from "@/models/chat";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";
import CreateChat from "@/components/Communications/Menus/CreateChat.vue";
import CommunicationsAvatar from "@/components/Communications/CommunicationsAvatar.vue";
import { ChatAssociation } from "@/models/chatAssociation";
import Message from "@/components/Communications/Message.vue";
import Paginate from "@/components/Core/Paginate.vue";

export default defineComponent({
  name: "ColubrinaMemberSidebarList",
  components: {
    Paginate,
    Message,
    CommunicationsAvatar,
    CreateChat,
    MessageSkeleton
  },
  data() {
    return {
      create: false,
      contextMenu: {
        dialog: false,
        x: 0,
        y: 0,
        item: {}
      }
    };
  },
  computed: {
    users() {
      return this.$chat.selectedChat?.users?.sort(
        (a: ChatAssociation, b: ChatAssociation) => {
          const aFriend = this.$friends.friends.find(
            (f) => f.otherUser.id === a.tpuUser?.id
          );
          const bFriend = this.$friends.friends.find(
            (f) => f.otherUser.id === b.tpuUser?.id
          );
          if (b.tpuUser?.id === this.$user.user?.id) return 2;
          if (a.tpuUser?.id === this.$user.user?.id) return -2;
          if (aFriend && bFriend) {
            if (aFriend.otherUser.status === "online") {
              return -1;
            } else if (bFriend.otherUser.status === "online") {
              return 1;
            } else {
              return 0;
            }
          } else if (aFriend) {
            return -1;
          } else if (bFriend) {
            return 1;
          } else {
            return 0;
          }
        }
      );
    }
  },
  methods: {
    async handleJump(messageId: number, associationId: number) {
      if (this.$chat.selectedChatId !== associationId) {
        this.$chat.selectedChatId = associationId;
        this.$router.push(`/communications/${associationId}`);
        await this.$chat.setChat(associationId);
      }
      await this.$chat.jumpToMessage(messageId);
    },
    context(e: any, item: any) {
      e.preventDefault();
      this.contextMenu.item = item;
      this.contextMenu.x = e.clientX;
      this.contextMenu.y = e.clientY;
      this.contextMenu.dialog = true;
    },
    chatName(chat: Chat) {
      if (chat.type === "direct") {
        return chat.recipient?.username || "Deleted User";
      } else {
        return chat.name;
      }
    }
  }
});
</script>
