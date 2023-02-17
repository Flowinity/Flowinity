<template>
  <v-navigation-drawer permanent color="dark" floating>
    <v-card-text class="text-overline my-n3">
      <v-btn size="xsmall" icon class="mr-2"><v-icon>mdi-plus</v-icon></v-btn
      >CHATS
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
      >
        <template v-slot:prepend>
          <v-avatar :color="!$functions.avatar(chat) ? '#0190ea' : undefined">
            <v-img
              :src="$functions.avatar(chat)"
              v-if="$functions.avatar(chat)"
            ></v-img>
            <v-icon v-else>{{
              chat.type === "group" ? "mdi-account-group" : "mdi-account"
            }}</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
      <v-list-item v-if="!$chat.chats.length">No chats</v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Chat } from "@/models/chat";

export default defineComponent({
  name: "ColubrinaSidebar",
  methods: {
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

<style scoped></style>
