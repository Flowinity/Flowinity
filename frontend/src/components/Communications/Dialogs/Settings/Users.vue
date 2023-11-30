<template>
  <TransferOwnership
    v-model="transferOwnership.value"
    :user="$user.users[transferOwnership.userId]"
    :chat="$chat.editingChat"
  />
  <overline position="center">
    {{ $t("chats.settings.users.name") }}
  </overline>
  <v-text-field
    v-model="search"
    :label="$t('generic.search')"
    class="mx-2"
    autofocus
  />
  <v-data-table :items="users" :headers="headers">
    <template #[`item.user.username`]="{ item }">
      <UserAvatar :user="item.user" />
      {{ item.user?.username || "Unresolved user" }}
      <template v-if="dev">({{ item.id }})</template>
      <template v-if="item.user?.id === $chat.editingChat.userId">
        <span>
          <v-tooltip activator="parent" location="top">
            {{ $t("chats.roles.owner") }}
          </v-tooltip>
          <v-icon color="gold">mdi-crown</v-icon>
        </span>
      </template>
    </template>
    <template #[`item.ranks`]="{ item }: any">
      <AddRole
        :ranks="$chat.editingChat.ranks"
        :association="item"
        :current-association-id="$chat.editingChat.association.id"
      />
      <v-chip
        v-for="rank in item.ranks"
        :key="rank.id"
        :color="rank.color"
        class="ml-2 my-1"
      >
        {{ rank.name }}
        <v-icon
          v-if="
            !rank.managed && $chat.canEditRank(rank.index, $chat.editingChat)
          "
          class="pointer ml-1"
          size="20"
          @click="
            $chat.toggleUserRank(
              item.id,
              $chat.editingChat.association.id,
              rank.id
            )
          "
        >
          mdi-close
        </v-icon>
      </v-chip>
    </template>
    <template #[`item.createdAt`]="{ item }">
      {{ $date(item.createdAt).fromNow() }}
    </template>
    <template #[`item.user.createdAt`]="{ item }">
      {{ $date(item.user?.createdAt).fromNow() }}
    </template>
    <template #[`item.actions`]="{ item }">
      <v-btn
        icon
        class="my-1"
        :disabled="item.user?.id === $chat.editingChat.userId"
        @click="
          $chat.changeUsers(
            [item.user?.id],
            false,
            $chat.editingChat.association.id
          )
        "
      >
        <v-tooltip activator="parent" location="top">
          {{ $t("chats.settings.users.remove") }}
        </v-tooltip>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn
        v-if="$chat.editingChat.userId === $user.user.id"
        icon
        class="my-1"
        :disabled="item.user?.id === $chat.editingChat.userId"
        @click="
          transferOwnership.userId = item.user?.id;
          transferOwnership.value = true;
        "
      >
        <v-tooltip activator="parent" location="top">
          {{ $t("chats.settings.users.transferOwnership") }}
        </v-tooltip>
        <v-icon>mdi-swap-horizontal</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Chat } from "@/gql/graphql";
import Overline from "@/components/Core/Typography/Overline.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import AddRole from "@/components/Communications/Menus/AddRole.vue";
import TransferOwnership from "@/components/Communications/Dialogs/TransferOwnership.vue";

export default defineComponent({
  name: "ChatSettingsUsers",
  components: {
    TransferOwnership,
    AddRole,
    UserAvatar,
    Overline
  },
  props: {
    chat: {
      type: Object as () => Chat
    }
  },
  data() {
    return {
      add: false,
      search: "",
      transferOwnership: {
        userId: undefined as number | undefined,
        value: false
      },
      headers: [
        {
          title: this.$t("chats.settings.users.username"),
          key: "user.username"
        },
        {
          title: this.$t("chats.settings.ranks.name"),
          key: "ranks"
        },
        {
          title: this.$t("chats.settings.users.createdAt"),
          key: "createdAt"
        },
        {
          title: this.$t("chats.settings.users.accountAge"),
          key: "user.createdAt"
        },
        {
          title: this.$t("chats.settings.users.actions"),
          key: "actions"
        }
      ]
    };
  },
  computed: {
    dev() {
      return import.meta.env.DEV;
    },
    users() {
      return this.$chat.editingChat.users
        .filter(
          (user) =>
            !user.legacyUserId &&
            this.$user.users[user.userId]?.username
              .toLowerCase()
              .includes(this.search.toLowerCase())
        )
        .map((user) => {
          return {
            ...user,
            user: this.$user.users[user.userId],
            ranks: user.ranksMap.map((rank) => {
              return this.$chat.editingChat.ranks.find((r) => {
                return r.id === rank;
              });
            })
          };
        });
    }
  }
});
</script>
