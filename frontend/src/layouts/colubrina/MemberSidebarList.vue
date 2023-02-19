<template>
  <v-card-text
    v-if="!$chat.communicationsSidebar"
    @click="$app.forcedMainDrawer = true"
    style="color: #0190ea; cursor: pointer; font-size: 12px"
  >
    <v-icon>mdi-arrow-left</v-icon>
    Back to Workspaces
  </v-card-text>
  <v-card-text class="text-overline my-n3">MEMBERS</v-card-text>
  <v-list nav v-if="$chat.selectedChat?.users">
    <v-list-item
      v-for="association in $chat.selectedChat.users"
      :title="association.user?.username || 'Deleted User'"
      :subtitle="association.legacyUser ? 'Legacy User' : undefined"
      @click="
        $chat.dialogs.user.username = association.user?.username;
        $chat.dialogs.user.value = true;
      "
    >
      <template v-slot:prepend>
        <CommunicationsAvatar
          :status="true"
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

export default defineComponent({
  name: "ColubrinaMemberSidebarList",
  components: { CommunicationsAvatar, CreateChat, MessageSkeleton },
  data() {
    return {
      create: false
    };
  },
  methods: {
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
