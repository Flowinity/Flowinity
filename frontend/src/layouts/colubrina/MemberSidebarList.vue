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
  <template v-if="$chat.selectedChat">
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
      <v-list-subheader class="ml-3 mb-n3">
        {{ $t("chats.members") }}
      </v-list-subheader>
      <v-list class="mb-n4" v-for="group in users" :key="group.name" nav>
        <template v-if="group.users.length">
          <v-list-subheader>
            {{ group.name }} ({{ group.users.length }})
          </v-list-subheader>
          <v-list-item
            v-for="association in group.users"
            :subtitle="association.legacyUser ? 'Legacy User' : undefined"
            @click="
              $chat.dialogs.user.username = association.user?.username;
              $chat.dialogs.user.value = true;
            "
            @contextmenu.prevent="context($event, association)"
          >
            <template v-slot:title>
              {{ $friends.getName(association.user) || "Deleted User" }}
              <span>
                <v-icon v-if="association.rank === 'owner'" color="gold">
                  mdi-crown
                </v-icon>
                <v-tooltip activator="parent" location="top">
                  {{ $t("chats.roles.owner") }}
                </v-tooltip>
              </span>
              <span>
                <v-icon v-if="association.rank === 'admin'" color="grey">
                  mdi-crown
                </v-icon>
                <v-tooltip activator="parent" location="top">
                  {{ $t("chats.roles.admin") }}
                </v-tooltip>
              </span>
            </template>
            <template v-slot:subtitle v-if="association.legacyUserId">
              {{ $t("chats.roles.legacyUser") }}
            </template>
            <template v-slot:prepend>
              <UserAvatar
                class="mr-2"
                :dot-status="true"
                :status="true"
                :user="association.user"
              ></UserAvatar>
            </template>
          </v-list-item>
        </template>
      </v-list>
    </div>
    <template v-else>
      <v-list-subheader class="ml-3 mb-4">
        {{ $t("generic.search") }}
        <v-progress-circular
          v-if="$chat.search.loading"
          indeterminate
          size="16"
          width="2"
        ></v-progress-circular>
        <template v-else>
          ({{ $chat.search.results.pager.totalItems }})
        </template>
      </v-list-subheader>
      <v-container class="mt-n8">
        <GalleryTextField
          v-model="$chat.search.query"
          @submit="$chat.doSearch"
          :autofocus="true"
        ></GalleryTextField>
      </v-container>
      <ol
        class="d-flex flex-column communications position-relative"
        v-if="!$chat.search.loading"
      >
        <MessagePerf
          v-for="(message, index) in $chat.search.results.items"
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
              $chat.chats.find((chat) => chat.id === message.chatId)
                ?.association.id || 0
            )
          "
          @jumpToMessage="
            handleJump(
              $event,
              $chat.chats.find((chat) => chat.id === message.chatId)
                ?.association.id || 0
            )
          "
        />
      </ol>
      <Paginate
        v-model="$chat.search.results.pager.currentPage"
        :max-visible="5"
        :total-pages="$chat.search.results.pager.totalPages"
        class="mb-2"
        @update:model-value="$chat.doSearch"
      ></Paginate>
    </template>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Chat } from "@/models/chat";
import { ChatAssociation } from "@/models/chatAssociation";
import Message from "@/components/Communications/Message.vue";
import Paginate from "@/components/Core/Paginate.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import SidebarItem from "@/components/Communications/SidebarItem.vue";
import { UserStatus } from "@/gql/graphql";
import GalleryTextField from "@/components/Gallery/GalleryTextField.vue";
import MessagePerf from "@/components/Communications/MessagePerf.vue";

export default defineComponent({
  name: "ColubrinaMemberSidebarList",
  components: {
    MessagePerf,
    GalleryTextField,
    SidebarItem,
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
      return [
        {
          name: this.$t("chats.roles.owner", 2),
          users: this.$chat.selectedChat.users.filter((user) => {
            return (
              user.rank === "owner" &&
              this.$user.getStatus({ id: user.userId }) !==
                UserStatus.Offline &&
              !user.legacyUserId
            );
          })
        },
        {
          name: this.$t("chats.roles.admin", 2),
          users: this.$chat.selectedChat.users.filter((user) => {
            return (
              user.rank === "admin" &&
              this.$user.getStatus({ id: user.userId }) !==
                UserStatus.Offline &&
              !user.legacyUserId
            );
          })
        },
        {
          name: this.$t("chats.roles.member", 2),
          users: this.$chat.selectedChat.users.filter((user) => {
            return (
              user.rank === "member" &&
              this.$user.getStatus({ id: user.userId }) !==
                UserStatus.Offline &&
              !user.legacyUserId
            );
          })
        },
        {
          name: this.$t("chats.roles.offline", 2),
          users: this.$chat.selectedChat.users.filter((user) => {
            return (
              this.$user.getStatus({ id: user.userId }) ===
                UserStatus.Offline && !user.legacyUserId
            );
          })
        },
        {
          name: this.$t("chats.roles.legacyUser", 1),
          users: this.$chat.selectedChat.users.filter((user) => {
            return user.legacyUserId;
          })
        }
      ];
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
