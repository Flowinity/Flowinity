<template>
  <div class="mr-2">
    <v-avatar :color="!$functions.avatar(chat || user) ? '#0190ea' : undefined">
      <v-img
        :src="$functions.avatar(chat || user)"
        v-if="$functions.avatar(chat || user)"
        cover
      ></v-img>
      <v-icon size="20" v-else-if="chat?.type === 'group'">
        mdi-account-group
      </v-icon>
      <span class="text-h5" v-else-if="user?.username">
        {{ user?.username?.charAt(0).toUpperCase() }}
      </span>
      <span class="text-h5" v-else-if="chat?.recipient?.username">
        {{ chat.recipient?.username?.charAt(0).toUpperCase() }}
      </span>
      <span class="text-h5" v-else>?</span>
    </v-avatar>
    <v-badge
      :color="$functions.userStatus(friendStatus).color"
      offset-x="2"
      bordered
      dot
      offset-y="8"
      v-if="friendStatus && user && status"
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
