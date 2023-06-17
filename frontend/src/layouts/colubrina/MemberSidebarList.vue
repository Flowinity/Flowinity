<template>
  <v-menu
    v-model="contextMenu.dialog"
    :style="menuStyle"
    style="z-index: 6001 !important"
  >
    <v-card>
      <v-list style="background: #121212 !important">
        <v-list-item
          @click="
            $app.dialogs.nickname.userId = contextMenu.item?.userId || 0;
            $app.dialogs.nickname.value = true;
          "
        >
          <v-icon class="mr-1">mdi-rename-outline</v-icon>
          Change Nickname
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
  <div v-if="$vuetify.display.mobile" class="mt-2">
    <UserAvatar
      :chat="$chat.selectedChat?.recipient ? null : $chat.selectedChat"
      :status="true"
      :user="$chat.selectedChat?.recipient"
      class="ml-4"
      size="32"
      style="display: inline-block"
      :dot-status="true"
    />
    <h4
      id="tpu-brand-logo"
      class="unselectable ml-2 limit"
      style="display: inline-block; align-self: center; text-align: center"
      title="TPU Communications"
    >
      {{ $chat.chatName }}
    </h4>
    <v-card-actions v-if="$chat.selectedChat">
      <v-spacer></v-spacer>
      <v-btn
        v-if="$experiments.experiments.PINNED_MESSAGES"
        aria-label="Toggle Communications Sidebar"
        class="mr-2"
        icon
      >
        <v-icon>mdi-pin</v-icon>
      </v-btn>
      <v-btn
        aria-label="Toggle Communications Search"
        class="mr-2"
        icon
        @click="$chat.search.value = !$chat.search.value"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn
        aria-label="Toggle Communications Settings"
        class="mr-2"
        icon
        @click="
          $chat.dialogs.groupSettings.value = true;
          $chat.selectedChat
            ? ($chat.dialogs.groupSettings.item = $chat.selectedChat)
            : () => {};
        "
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </div>
  <div class="position-relative" v-if="!$chat.search.value">
    <v-card-text class="text-overline my-n3">
      {{ $t("chats.members") }}
    </v-card-text>
    <v-virtual-scroll
      item-height="40"
      :items="users"
      v-if="$chat.selectedChat"
      style="overflow-x: hidden"
    >
      <template v-slot:default="{ item: { user, legacyUser, rank } }">
        <div
          :key="user.id"
          class="member-sidebar-item unselectable"
          @click="
            legacyUser ? null : ($chat.dialogs.user.username = user.username);
            legacyUser ? null : ($chat.dialogs.user.value = true);
          "
          :class="{ pointer: !legacyUser }"
        >
          <UserAvatar
            :user="user"
            :status="true"
            :dot-status="true"
          ></UserAvatar>
          <div class="ml-2">
            <span class="limit">
              {{
                legacyUser
                  ? user.username
                  : $friends.getName(user.id) || user.username
              }}
              <span v-if="rank === 'owner'">
                <v-icon color="gold">mdi-crown</v-icon>
                <v-tooltip :eager="false" activator="parent" location="top">
                  Owner
                </v-tooltip>
              </span>

              <span v-else-if="rank === 'admin'">
                <v-icon color="grey">mdi-crown</v-icon>
                <v-tooltip :eager="false" activator="parent" location="top">
                  Administrator
                </v-tooltip>
              </span>
            </span>
            <p class="text-subtitle-2 mt-n1 text-grey" v-if="legacyUser">
              Legacy user
            </p>
          </div>
        </div>
      </template>
    </v-virtual-scroll>
  </div>
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
        append-icon="mdi-magnify"
        :autofocus="true"
        label="Search Query"
        @click:append="$chat.doSearch"
        @keyup.enter="$chat.doSearch"
      ></v-text-field>
    </v-container>
    <v-list v-if="!$chat.search.loading">
      <Message
        v-for="(message, index) in $chat.search.results.messages"
        :id="'message-' + index"
        :key="message.id"
        :message="message"
        :search="true"
        class="pointer"
        @authorClick="
          $chat.dialogs.userMenu.user = $event.user;
          $chat.dialogs.userMenu.username = $event.user.username;
          $chat.dialogs.userMenu.bindingElement = $event.bindingElement;
          $chat.dialogs.userMenu.x = $event.x;
          $chat.dialogs.userMenu.y = $event.y;
          $chat.dialogs.userMenu.location = $event.location || 'top';
        "
        @click="
          handleJump(
            message.id,
            $chat.chats.find((chat) => chat.id === message.chatId)?.association
              .id || 0
          )
        "
        @jumpToMessage="
          handleJump(
            $event,
            $chat.chats.find((chat) => chat.id === message.chatId)?.association
              .id || 0
          )
        "
      />
    </v-list>
    <Paginate
      v-model="$chat.search.results.pager.currentPage"
      :max-visible="5"
      :total-pages="$chat.search.results.pager.totalPages"
      class="mb-2"
      @update:model-value="$chat.doSearch"
    ></Paginate>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Chat } from "@/models/chat";
import { ChatAssociation } from "@/models/chatAssociation";
import Message from "@/components/Communications/Message.vue";
import Paginate from "@/components/Core/Paginate.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
export default defineComponent({
  name: "ColubrinaMemberSidebarList",
  components: {
    Paginate,
    Message,
    UserAvatar
  },
  data() {
    return {
      create: false,
      contextMenu: {
        dialog: false,
        x: 0,
        y: 0,
        item: null as ChatAssociation | null
      }
    };
  },
  computed: {
    height() {
      if (this.$vuetify.display.mobile) return "calc(100vh - 300px)";
      return "calc(100vh - 64px)";
    },
    users() {
      if (!this.$chat.selectedChat) return [];
      return [...this.$chat.selectedChat.users].sort(
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
    },
    menuStyle() {
      return `
        position: absolute;
        top: ${this.contextMenu.y}px;
        left: ${this.contextMenu.x + 10}px;`;
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
