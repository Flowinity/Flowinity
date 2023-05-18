<template>
  <div class="mr-2">
    <v-avatar :color="!$functions.avatar(chat || user) ? '#0190ea' : undefined">
      <v-img
        v-if="$functions.avatar(chat || user)"
        :src="$functions.avatar(chat || user)"
        cover
      ></v-img>
      <v-icon v-else-if="chat?.type === 'group'" size="20">
        mdi-account-group
      </v-icon>
      <span v-else-if="user?.username" class="text-h5">
        {{ user?.username?.charAt(0).toUpperCase() }}
      </span>
      <span v-else-if="chat?.recipient?.username" class="text-h5">
        {{ chat.recipient?.username?.charAt(0).toUpperCase() }}
      </span>
      <span v-else class="text-h5">?</span>
    </v-avatar>
    <v-badge
      v-if="friendStatus && user && status"
      :color="$functions.userStatus(friendStatus).color"
      bordered
      dot
      offset-x="2"
      offset-y="8"
    >
      <v-tooltip activator="parent" location="top">
        {{ $functions.userStatus(friendStatus).text }}
      </v-tooltip>
    </v-badge>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CommunicationsAvatar",
  props: ["user", "chat", "status"],
  computed: {
    friendStatus() {
      if (!this.user) return;
      if (this.user.id === this.$user.user?.id)
        return this.$user.user?.storedStatus;
      return this.$friends.friends.find((f) => f.friendId === this.user.id)
        ?.otherUser?.status;
    }
  }
});
</script>

<style></style>
