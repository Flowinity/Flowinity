<template>
  <v-menu
    v-model="contextMenu.dialog"
    :style="menuStyle"
    style="z-index: 6001 !important"
  >
    <v-card>
      <v-list>
        <v-list-item
          v-if="$chat.hasPermission('MANAGE_RANKS', $chat.selectedChat)"
          @click="() => {}"
        >
          <v-menu
            :close-delay="100"
            :close-on-click="false"
            :close-on-content-click="false"
            :nudge-right="10"
            :open-delay="0"
            activator="parent"
            bottom
            class="ml-2"
            location="left"
            offset-x
            open-on-hover
          >
            <v-list max-height="400" min-width="200" max-width="500">
              <v-text-field
                v-model="searchRanks"
                :autofocus="true"
                class="mx-5 my-n1"
                label="Search"
              ></v-text-field>
              <v-list-item
                v-for="rank in ranksFiltered"
                :active="contextMenu.item.ranksMap.includes(rank.id)"
                :value="rank.id"
                :key="rank.id"
                :disabled="
                  rank.managed ||
                  !$chat.canEditRank(rank.index, $chat.selectedChat)
                "
                @click="
                  $chat.toggleUserRank(
                    contextMenu.item.id,
                    $chat.selectedChat.association.id,
                    rank.id
                  )
                "
              >
                <template v-slot:prepend>
                  <v-avatar
                    class="v-avatar--variant-outlined pointer"
                    :color="rank.color"
                    size="22"
                  ></v-avatar>
                </template>
                <template v-slot:append>
                  <v-list-item-action start>
                    <v-checkbox-btn
                      :model-value="contextMenu.item.ranksMap.includes(rank.id)"
                      color="primary"
                    ></v-checkbox-btn>
                  </v-list-item-action>
                </template>
                <v-list-item-title>{{ rank.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-icon class="mr-1">mdi-arrow-left</v-icon>
          Roles
        </v-list-item>
        <UserSidebarOptions
          :user="$user.users[contextMenu.item.userId]"
          v-if="$user.users[contextMenu.item.userId]"
        ></UserSidebarOptions>
      </v-list>
    </v-card>
  </v-menu>
  <template v-if="$chat.selectedChat && $route.path !== '/communications/home'">
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
        {{ $chat.chatName($chat.selectedChat) }}
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
              ? ($chat.dialogs.groupSettings.itemId = $chat.selectedChat.id)
              : () => {};
          "
        >
          <v-icon>mdi-cog</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </div>
    <div v-if="!$chat.search.value" class="mt-n2">
      <v-list class="mb-n4" v-for="group in ranks" :key="group.name" nav>
        <template v-if="group.users.length">
          <overline position="start">
            {{ group.name }} ({{ group.users.length }})
          </overline>
          <v-list-item
            v-for="association in group.users"
            :subtitle="association.legacyUser ? 'Legacy User' : undefined"
            @click="
              $chat.dialogs.user.username = association.user?.username;
              $chat.dialogs.user.value = true;
            "
            @contextmenu.prevent="context($event, association)"
            :style="{
              color: $chat.getRankColor(
                association.ranksMap,
                $chat.selectedChat.ranks
              )
            }"
            :class="{
              'black-and-white':
                $user.users[association.userId]?.status === UserStatus.Offline
            }"
          >
            <template v-slot:title>
              {{ $friends.getName(association.user) || "Deleted User" }}
              <v-chip
                class="ml-1"
                v-if="$user.users[association.userId]?.bot"
                size="x-small"
              >
                BOT
              </v-chip>
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
      <v-container class="mt-n8 mb-8">
        <GalleryTextField
          v-model="$chat.search.query"
          @submit="$chat.doSearch(sort)"
          :autofocus="true"
        ></GalleryTextField>
        <div class="float-right">
          <v-btn-toggle v-model="sort" density="compact">
            <v-btn>Newest</v-btn>
            <v-btn>Oldest</v-btn>
          </v-btn-toggle>
        </div>
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
          @click="
            handleJump(
              message.id,
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
        @update:model-value="$chat.doSearch(sort)"
      ></Paginate>
    </template>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Message from "@/components/Communications/Message.vue";
import Paginate from "@/components/Core/Paginate.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import SidebarItem from "@/components/Communications/SidebarItem.vue";
import {
  ChatAssociation,
  FriendStatus,
  UserStatus,
  Chat,
  ChatRank,
  UserStoredStatus
} from "@/gql/graphql";
import GalleryTextField from "@/components/Gallery/GalleryTextField.vue";
import MessagePerf from "@/components/Communications/MessagePerf.vue";
import Overline from "@/components/Core/Typography/Overline.vue";
import UserSidebarOptions from "@/components/Communications/Menus/UserSidebarOptions.vue";
import AddRole from "@/components/Communications/Menus/AddRole.vue";

export default defineComponent({
  name: "ColubrinaMemberSidebarList",
  components: {
    AddRole,
    UserSidebarOptions,
    Overline,
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
      sort: 0,
      contextMenu: {
        dialog: false,
        x: 0,
        y: 0,
        item: null as ChatAssociation | null
      },
      searchRanks: ""
    };
  },
  computed: {
    ranksFiltered() {
      return (
        this.$chat.selectedChat?.ranks.filter((rank: ChatRank) =>
          rank.name.toLowerCase().includes(this.searchRanks.toLowerCase())
        ) || []
      );
    },
    FriendStatus() {
      return FriendStatus;
    },
    UserStatus() {
      return UserStatus;
    },
    height() {
      if (this.$vuetify.display.mobile) return "calc(100vh - 300px)";
      return "calc(100vh - 64px)";
    },
    ranks() {
      if (!this.$chat.selectedChat) return [];
      return [
        ...this.$chat.selectedChat.ranks.map((rank) => {
          return {
            ...rank,
            users: this.$chat.selectedChat.users
              .filter((user) => {
                return (
                  user.ranksMap[0] === rank.id &&
                  (user.userId === this.$user.user?.id ||
                    (this.$user.users[user.userId]?.status !==
                      UserStatus.Offline &&
                      this.$user.users[user.id]?.status !==
                        UserStoredStatus.Invisible &&
                      this.$user.users[user.userId]?.status))
                );
              })
              .map((user) => {
                return {
                  ...user,
                  user: this.$user.users[user.userId]
                };
              })
          };
        }),
        {
          name: this.$t("chats.roles.online"),
          users: this.$chat.selectedChat.users
            .filter((user) => {
              return (
                this.$user.users[user.userId]?.status !== UserStatus.Offline &&
                !user.ranksMap.length &&
                !user.legacyUserId
              );
            })
            .map((user) => {
              return {
                ...user,
                user: this.$user.users[user.userId]
              };
            })
        },
        {
          name: this.$t("chats.roles.offline"),
          users: this.$chat.selectedChat.users
            .filter((user) => {
              return (
                this.$user.users[user.userId]?.status === UserStatus.Offline &&
                user.userId !== this.$user.user?.id
              );
            })
            .map((user) => {
              return {
                ...user,
                user: this.$user.users[user.userId]
              };
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
      this.contextMenu.x = e.clientX + window.scrollX;
      this.contextMenu.y = e.clientY + window.scrollY;
      this.contextMenu.dialog = true;
    },
    chatName(chat: Chat) {
      if (chat.type === "direct") {
        return chat.recipient?.username || "Deleted User";
      } else {
        return chat.name;
      }
    }
  },
  watch: {
    sort(val) {
      this.$chat.doSearch(val);
    }
  }
});
</script>
