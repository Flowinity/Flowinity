<template>
  <Leave v-model="leave.dialog" :chat="leave.chat" />
  <v-menu
    :style="menuStyle"
    location="top"
    v-model="contextMenu.dialog"
    style="z-index: 2003"
  >
    <v-list style="background: #151515 !important">
      <v-list-item @click="() => {}">
        <v-menu
          :nudge-right="10"
          :close-delay="100"
          :open-delay="0"
          :close-on-content-click="false"
          :close-on-click="false"
          bottom
          offset-x
          open-on-hover
          activator="parent"
          location="right"
          class="ml-2"
        >
          <v-list
            v-if="contextMenu.item"
            style="background: #151515 !important"
          >
            <v-list-item @click="setNotifications('all')">
              <v-list-item-title>All messages</v-list-item-title>
              <template v-slot:append>
                <v-icon
                  style="float: right"
                  v-if="contextMenu.item.association.notifications === 'all'"
                >
                  mdi-check
                </v-icon>
              </template>
            </v-list-item>
            <v-list-item @click="setNotifications('mentions')">
              <v-list-item-title>Mentions only</v-list-item-title>
              <template v-slot:append>
                <v-icon
                  style="float: right"
                  v-if="
                    contextMenu.item.association.notifications === 'mentions'
                  "
                >
                  mdi-check
                </v-icon>
              </template>
            </v-list-item>
            <v-list-item two-line @click="setNotifications('none')">
              <v-list-item-title>None</v-list-item-title>
              <v-list-item-subtitle>
                This chat will be completely muted.
              </v-list-item-subtitle>
              <template v-slot:append>
                <v-icon
                  style="float: right"
                  v-if="contextMenu.item.association.notifications === 'none'"
                >
                  mdi-check
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-list-item-title>
          <v-icon class="mr-1">mdi-bell-outline</v-icon>
          Notifications
          <v-icon class="ml-5">mdi-arrow-right</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="contextMenu.item?.recipient"
        @click="
          $app.dialogs.nickname.userId = contextMenu.item?.recipient?.id || 0;
          $app.dialogs.nickname.value = true;
        "
      >
        <v-icon class="mr-1">mdi-rename-outline</v-icon>
        Change Nickname
      </v-list-item>
      <v-list-item
        v-if="
          contextMenu.item?.type === 'group' &&
          (contextMenu.item.association?.rank === 'admin' ||
            contextMenu.item.association?.rank === 'owner')
        "
        @click="
          $chat.dialogs.groupSettings.item = contextMenu.item;
          $chat.dialogs.groupSettings.value = true;
        "
      >
        <v-icon class="mr-1">mdi-cog-outline</v-icon>
        Group Settings
      </v-list-item>
      <v-list-item
        color="red"
        @click="
          leave.chat = contextMenu.item;
          leave.dialog = true;
        "
      >
        <v-icon class="mr-1">mdi-exit-to-app</v-icon>
        <template
          v-if="contextMenu.item?.users && contextMenu.item?.users?.length > 1"
        >
          Leave
        </template>
        <template v-else>Delete</template>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-card-text
    v-if="!$chat.communicationsSidebar"
    @click="$app.forcedMainDrawer = true"
    style="color: rgb(var(--v-theme-primary)); cursor: pointer; font-size: 12px"
    class="unselectable"
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
          :content="chat.unread > 99 ? '99+' : chat.unread"
          color="red"
          overlap
          :class="chat.unread > 99 ? 'mr-5' : 'mr-4'"
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
import Leave from "@/components/Communications/Dialogs/Leave.vue";

export default defineComponent({
  name: "ColubrinaSidebarList",
  components: { Leave, CommunicationsAvatar, CreateChat, MessageSkeleton },
  data() {
    return {
      create: false,
      leave: {
        dialog: false,
        chat: undefined as Chat | undefined
      },
      contextMenu: {
        dialog: false,
        x: 0,
        y: 0,
        item: undefined as Chat | undefined
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
    setNotifications(type: "all" | "mentions" | "none") {
      if (!this.contextMenu.item?.association) return;
      this.axios.patch(
        `/chats/association/${this.contextMenu.item?.association.id}`,
        {
          notifications: type
        }
      );
      this.contextMenu.item.association.notifications = type;
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
        return this.$friends.getName(chat.recipient) || "Deleted User";
      } else {
        return chat.name;
      }
    }
  }
});
</script>
