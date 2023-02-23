<template>
  <v-menu
    :style="menuStyle"
    location="top"
    v-model="contextMenu.dialog"
    style="z-index: 2003"
  >
    <v-list>
      <v-list-item
        v-if="contextMenu.item?.type === 'group'"
        @click="
          $chat.dialogs.groupSettings.item = contextMenu.item;
          $chat.dialogs.groupSettings.value = true;
        "
      >
        Group Settings
      </v-list-item>
      <v-list-item color="red">Leave</v-list-item>
    </v-list>
  </v-menu>
  <v-card-text
    v-if="!$chat.communicationsSidebar"
    @click="$app.forcedMainDrawer = true"
    style="color: #0190ea; cursor: pointer; font-size: 12px"
  >
    <v-icon>mdi-arrow-left</v-icon>
    Back to TPU
  </v-card-text>
  <v-card-text class="text-overline my-n3">
    <CreateChat v-model="create" v-slot="{ props }" type="create">
      <v-btn
        size="xsmall"
        icon
        class="mr-2"
        @click="create = true"
        v-bind="props"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </CreateChat>
    CHATS
  </v-card-text>
  <v-list nav>
    <v-list-item
      v-for="chat in $chat.chats"
      :title="chatName(chat)"
      :subtitle="
        chat.type === 'group'
          ? `${chat.users?.length} members`
          : chat.recipient?.legacyUser
          ? 'Legacy User'
          : ''
      "
      :to="`/communications/${chat.association.id}`"
      @contextmenu.prevent="context($event, chat)"
    >
      <template v-slot:prepend>
        <CommunicationsAvatar
          :status="true"
          :chat="chat.type === 'group' ? chat : undefined"
          :user="chat.type === 'direct' ? chat.recipient : undefined"
        ></CommunicationsAvatar>
      </template>
      <template v-slot:append>
        <v-badge
          v-if="chat.unread"
          :content="chat.unread"
          color="red"
          overlap
          class="mr-2"
        ></v-badge>
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
  name: "ColubrinaSidebarList",
  components: { CommunicationsAvatar, CreateChat, MessageSkeleton },
  data() {
    return {
      create: false,
      contextMenu: {
        dialog: false,
        x: 0,
        y: 0,
        item: null as Chat | null
      }
    };
  },
  computed: {
    menuStyle() {
      return `
        position: absolute;
        top: ${this.contextMenu.y}px;
        left: ${this.contextMenu.x}px;`;
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
