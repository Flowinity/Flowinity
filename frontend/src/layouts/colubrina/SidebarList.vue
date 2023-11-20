<template>
  <Leave v-model="$chat.dialogs.leave.value" />
  <v-menu
    v-model="contextMenu.dialog"
    :style="menuStyle"
    location="top"
    style="z-index: 2003"
  >
    <v-card>
      <v-list>
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
            <v-card>
              <v-list v-if="contextMenu.item">
                <v-list-item @click="setNotifications('all')">
                  <v-list-item-title>
                    {{ $t("chats.notificationOptions.all") }}
                  </v-list-item-title>
                  <template v-slot:append>
                    <v-icon
                      v-if="
                        contextMenu.item.association.notifications === 'all'
                      "
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
                        contextMenu.item.association.notifications ===
                        'mentions'
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
                      v-if="
                        contextMenu.item.association.notifications === 'none'
                      "
                      style="float: right"
                    >
                      mdi-check
                    </v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
          <v-list-item-title>
            <v-icon class="mr-1">mdi-bell-outline</v-icon>
            {{ $t("chats.notifications") }}
            <v-icon class="ml-5">mdi-arrow-right</v-icon>
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="
            $chat.hasPermission(
              [
                'ADMIN',
                'OVERVIEW',
                'VIEW_AUDIT_LOG',
                'ADD_USERS',
                'REMOVE_USERS',
                'OWNER',
                'BAN_USERS',
                'REMOVE_USERS',
                'CREATE_EMOJI',
                'MANAGE_INTEGRATIONS',
                'MANAGE_RANKS',
                'VIEW_INSIGHTS'
              ],
              contextMenu.item
            )
          "
          @click="
            $chat.dialogs.groupSettings.itemId = contextMenu.item.id;
            $chat.dialogs.groupSettings.value = true;
          "
        >
          <v-icon class="mr-1">mdi-cog-outline</v-icon>
          Group Settings
        </v-list-item>
        <UserSidebarOptions
          :user="$user.users[contextMenu.item.recipient?.id]"
          v-if="
            contextMenu.item?.type === 'direct' &&
            $user.users[contextMenu.item.recipient?.id]
          "
          :hide-message="true"
        />
        <v-list-item
          v-if="
            contextMenu.item?.userId !== $user.user?.id &&
            contextMenu.item?.type !== 'direct'
          "
          @click="
            $chat.dialogs.leave.itemId = contextMenu.item.id;
            $chat.dialogs.leave.value = true;
          "
          style="color: rgb(var(--v-theme-error))"
        >
          <v-icon class="mr-1">mdi-exit-to-app</v-icon>
          {{ $t("generic.leave") }}
        </v-list-item>
        <v-list-item
          v-if="contextMenu.item?.type === 'direct'"
          @click="$chat.leaveChat(contextMenu.item.association.id)"
        >
          <v-icon class="mr-1">mdi-close</v-icon>
          {{ $t("generic.close") }}
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
  <overline class="ml-3 mb-n1" position="start">
    <CreateChat v-slot="{ props }" v-model="create" type="create">
      <v-btn class="mr-1" icon size="xsmall" v-bind="props">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </CreateChat>
    {{ $t("chats.chats") }}
  </overline>
  <v-list nav>
    <v-list-item
      v-for="chat in $chat.chats"
      :subtitle="
        chat.type === 'group'
          ? `${chat.users?.length} members`
          : !chat.recipient?.id
          ? 'Legacy User'
          : ''
      "
      :to="`/communications/${chat.association.id}`"
      @contextmenu.prevent="context($event, chat)"
      :key="chat.id"
      :class="{
        'black-and-white': chat.association.notifications === 'none'
      }"
      class="position-relative"
    >
      <template v-slot:title>
        {{ $chat.chatName(chat) }}
        <v-chip
          class="ml-1"
          v-if="$user.users[chat.recipient?.id]?.bot"
          size="x-small"
        >
          BOT
        </v-chip>
      </template>
      <template v-slot:prepend>
        <UserAvatar
          :chat="chat.type === 'group' ? chat : undefined"
          :status="true"
          :user="
            chat.type === 'direct' ? $user.users[chat.recipient?.id] : undefined
          "
          :dot-status="true"
          class="mr-2"
        />
      </template>
      <template v-slot:append v-if="chat.unread">
        a
        <v-badge
          :class="chat.unread > 99 ? 'mr-6' : 'mr-4'"
          :content="chat.unread > 99 ? '99+' : chat.unread"
          color="red"
        />
      </template>
    </v-list-item>
    <v-list-item v-if="!$chat.chats.length" class="fade-skeleton">
      <MessageSkeleton v-for="i in 5" :animate="false" :key="i" />
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";
import CreateChat from "@/components/Communications/Menus/CreateChat.vue";
import Leave from "@/components/Communications/Dialogs/Leave.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import SidebarItem from "@/components/Communications/SidebarItem.vue";
import { Chat, UserStatus } from "@/gql/graphql";
import Overline from "@/components/Core/Typography/Overline.vue";
import UserSidebarOptions from "@/components/Communications/Menus/UserSidebarOptions.vue";

export default defineComponent({
  components: {
    UserSidebarOptions,
    Overline,
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
    UserStatus() {
      return UserStatus;
    },
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
      this.contextMenu.x = e.clientX + window.scrollX;
      this.contextMenu.y = e.clientY + window.scrollY;
      this.contextMenu.dialog = true;
    }
  }
});
</script>
