<template>
  <overline position="center">
    {{ $t("chats.settings.users.name") }}
  </overline>
  <v-data-table :items="users" :headers="headers">
    <template v-slot:item.user.username="{ item: { selectable } }: any">
      <UserAvatar :user="selectable.user"></UserAvatar>
      {{ selectable.user.username }} ({{ selectable.id }})
      <template v-if="selectable.user.id === $chat.editingChat.userId">
        <span>
          <v-tooltip activator="parent" location="top">
            {{ $t("chats.roles.owner") }}
          </v-tooltip>
          <v-icon color="gold">mdi-crown</v-icon>
        </span>
      </template>
    </template>
    <template v-slot:item.ranks="{ item: { selectable } }: any">
      <AddRole
        :ranks="$chat.editingChat.ranks"
        :association="selectable"
        :current-association-id="$chat.editingChat.association.id"
      ></AddRole>
      <v-chip
        v-for="rank in selectable.ranks"
        :key="rank.id"
        :color="rank.color"
        class="ml-2"
      >
        {{ rank.name }}
      </v-chip>
    </template>
    <template v-slot:item.createdAt="{ item: { selectable } }">
      {{ $date(selectable.createdAt).fromNow() }}
    </template>
    <template v-slot:item.user.createdAt="{ item: { selectable } }">
      {{ $date(selectable.user.createdAt).fromNow() }}
    </template>
    <template v-slot:item.actions="{ item: { selectable } }">
      <v-btn
        icon
        class="my-1"
        :disabled="selectable.user.id === $chat.editingChat.userId"
      >
        <v-tooltip activator="parent" location="top">
          {{ this.$t("chats.settings.users.remove") }}
        </v-tooltip>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn
        icon
        class="my-1"
        :disabled="
          selectable.user.id === $chat.editingChat.userId &&
          $chat.editingChat.userId === $user.user.id
        "
      >
        <v-tooltip activator="parent" location="top">
          {{ this.$t("chats.settings.users.transferOwnership") }}
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
import GraphWidget from "@/components/Dashboard/GraphWidget.vue";
import CreateChat from "@/components/Communications/Menus/CreateChat.vue";
import AddRole from "@/components/Communications/Menus/AddRole.vue";

export default defineComponent({
  name: "ChatSettingsUsers",
  components: { AddRole, CreateChat, GraphWidget, UserAvatar, Overline },
  props: {
    chat: {
      type: Object as () => Chat
    }
  },
  data() {
    return {
      add: false,
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
    users() {
      return this.$chat.editingChat.users.map((user) => {
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

<style scoped></style>
