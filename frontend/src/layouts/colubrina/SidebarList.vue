<template>
  <Leave v-model="leave.dialog" :chat="leave.chat" />
  <v-menu
    v-model="contextMenu.dialog"
    :style="menuStyle"
    location="top"
    style="z-index: 2003"
  >
    <v-list style="background: #151515 !important">
      <v-list-item @click="() => {}">
        <v-menu
          :close-delay="100"
          :close-on-click="false"
          :close-on-content-click="false"
          :nudge-right="10"
          :open-delay="0"
          activator="parent"
          bottom
          class="ml-2"
          location="right"
          offset-x
          open-on-hover
        >
          <v-list
            v-if="contextMenu.item"
            style="background: #151515 !important"
          >
            <v-list-item @click="setNotifications('all')">
              <v-list-item-title>
                {{ $t("chats.notificationOptions.all") }}
              </v-list-item-title>
              <template v-slot:append>
                <v-icon
                  v-if="contextMenu.item.association.notifications === 'all'"
                  style="float: right"
                >
                  mdi-check
                </v-icon>
              </template>
            </v-list-item>
            <v-list-item @click="setNotifications('mentions')">
              <v-list-item-title>
                {{ $t("chats.notificationOptions.mentions") }}
              </v-list-item-title>
              <template v-slot:append>
                <v-icon
                  v-if="
                    contextMenu.item.association.notifications === 'mentions'
                  "
                  style="float: right"
                >
                  mdi-check
                </v-icon>
              </template>
            </v-list-item>
            <v-list-item two-line @click="setNotifications('none')">
              <v-list-item-title>
                {{ $t("chats.notificationOptions.none") }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t("chats.notificationOptions.noneDesc") }}
              </v-list-item-subtitle>
              <template v-slot:append>
                <v-icon
                  v-if="contextMenu.item.association.notifications === 'none'"
                  style="float: right"
                >
                  mdi-check
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-list-item-title>
          <v-icon class="mr-1">mdi-bell-outline</v-icon>
          {{ $t("chats.notifications") }}
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
        {{ $t("chats.changeNickname") }}
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
          {{ $t("generic.leave") }}
        </template>
        <template v-else>
          {{ $t("generic.delete") }}
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
  <!-- convert to uppercase -->
  <v-card-text
    class="text-overline mb-n4 unselectable"
    style="text-transform: uppercase"
  >
    <CreateChat v-slot="{ props }" v-model="create" type="create">
      <v-btn
        class="mr-2"
        icon
        size="xsmall"
        v-bind="props"
        @click="create = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </CreateChat>
    {{ $t("chats.chats") }}
  </v-card-text>
  <v-virtual-scroll
    item-height="48"
    :items="$chat.chats"
    v-if="$chat.chats.length"
    style="overflow-x: hidden"
  >
    <template v-slot:default="{ item: chat }">
      <SidebarItem
        :legacy-user="chat.recipient?.legacyUser"
        :user="chat.recipient"
        :chat="chat"
        :subtitle="
          chat.type === 'group'
            ? `${chat.users?.length} members`
            : chat.recipient?.legacyUser
            ? 'Legacy User'
            : ''
        "
      />
    </template>
  </v-virtual-scroll>
  <v-list nav v-if="false">
    <v-list-item
      v-for="chat in $chat.chats"
      :subtitle="
        chat.type === 'group'
          ? `${chat.users?.length} members`
          : chat.recipient?.legacyUser
          ? 'Legacy User'
          : ''
      "
      :title="chatName(chat)"
      :to="`/communications/${chat.association.id}`"
      @contextmenu.prevent="context($event, chat)"
      :key="chat.id"
    >
      <template v-slot:prepend>
        <UserAvatar
          :chat="chat.type === 'group' ? chat : undefined"
          :status="true"
          :user="chat.type === 'direct' ? chat.recipient : undefined"
          :dot-status="true"
          class="mr-2"
        ></UserAvatar>
      </template>
      <template v-slot:append>
        <v-badge
          v-if="chat.unread"
          :class="chat.unread > 99 ? 'mr-5' : 'mr-4'"
          :content="chat.unread > 99 ? '99+' : chat.unread"
          color="red"
          overlap
        ></v-badge>
      </template>
    </v-list-item>
    <v-list-item v-if="!$chat.chats.length" class="fade-skeleton">
      <MessageSkeleton
        v-for="i in 5"
        :animate="false"
        :key="i"
      ></MessageSkeleton>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Chat } from "@/models/chat";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";
import CreateChat from "@/components/Communications/Menus/CreateChat.vue";
import Leave from "@/components/Communications/Dialogs/Leave.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import SidebarItem from "@/components/Communications/SidebarItem.vue";

export default defineComponent({
  name: "ColubrinaSidebarList",
  components: {
    SidebarItem,
    UserAvatar,
    Leave,
    CreateChat,
    MessageSkeleton
  },
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
