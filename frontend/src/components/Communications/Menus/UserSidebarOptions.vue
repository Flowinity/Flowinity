<template>
  <v-list-item @click="$router.push(`/u/${$user.users[user.id]?.username}`)">
    <v-icon class="mr-1">mdi-account</v-icon>
    View Profile Page
  </v-list-item>
  <v-list-item
    @click="chat(user?.id)"
    v-if="
      !hideMessage && $friends.friendStatus(user?.id) === FriendStatus.Accepted
    "
  >
    <v-icon class="mr-1">mdi-message-processing</v-icon>
    Message
  </v-list-item>
  <v-list-item
    @click="
      $app.dialogs.nickname.userId = user?.id || 0;
      $app.dialogs.nickname.value = true;
    "
    v-if="$friends.friendStatus(user?.id) === FriendStatus.Accepted"
  >
    <v-icon class="mr-1">mdi-rename-outline</v-icon>
    {{ $t("chats.changeNickname") }}
  </v-list-item>
  <v-list-item
    :style="{
      color: $user.blocked.find((blocked) => blocked.blockedUserId === user?.id)
        ? 'rgb(var(--v-theme-info))'
        : 'rgb(var(--v-theme-error))'
    }"
    @click="
      $user.dialogs.block.userId = user.id;
      $user.dialogs.block.username = $user.users[user.id]?.username;
      $user.dialogs.block.value = true;
    "
  >
    <template
      v-if="$user.blocked.find((blocked) => blocked.blockedUserId === user.id)"
    >
      <v-icon class="mr-1">mdi-account-check</v-icon>
      {{ $t("dialogs.unblock.action") }}
    </template>
    <template v-else>
      <v-icon class="mr-1">mdi-account-cancel</v-icon>
      {{ $t("dialogs.block.action") }}
    </template>
  </v-list-item>
  <v-list-item
    @click="$router.push(`/u/${$user.users[user.id]?.username}`)"
    style="color: rgb(var(--v-theme-error))"
    v-if="false && user.id !== $user.user?.id"
  >
    <v-icon class="mr-1">mdi-flag</v-icon>
    Report
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FriendStatus, PartialUserFriend } from "@/gql/graphql";

export default defineComponent({
  name: "UserSidebarOptions",
  computed: {
    FriendStatus() {
      return FriendStatus;
    }
  },
  props: {
    user: {
      type: Object as () => PartialUserFriend
    },
    hideMessage: {
      type: Boolean
    }
  },
  methods: {
    async chat(userId: number) {
      const data = await this.$chat.createChat([userId]);
      this.$router.push(`/communications/${data.association.id}`);
    }
  }
});
</script>
