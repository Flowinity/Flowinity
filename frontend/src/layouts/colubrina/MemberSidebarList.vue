<template>
  <v-card-text
    v-if="!$chat.communicationsSidebar"
    @click="$app.forcedWorkspaceDrawer = true"
    style="color: #0190ea; cursor: pointer; font-size: 12px"
  >
    <v-icon>mdi-arrow-left</v-icon>
    Back to Workspaces
  </v-card-text>
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

<script lang="ts">
import { defineComponent } from "vue";
import { Chat } from "@/models/chat";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";
import CreateChat from "@/components/Communications/Menus/CreateChat.vue";
import CommunicationsAvatar from "@/components/Communications/CommunicationsAvatar.vue";
import { ChatAssociation } from "@/models/chatAssociation";

export default defineComponent({
  name: "ColubrinaMemberSidebarList",
  components: { CommunicationsAvatar, CreateChat, MessageSkeleton },
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
