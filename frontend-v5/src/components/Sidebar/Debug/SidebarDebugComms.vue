<template>
  <div v-if="chatStore.selectedChat">
    <p class="mt-2 mb-n4">{{ chatStore.selectedChat.name }}</p>
    <tpu-overline>User Permissions for Chat</tpu-overline>
    {{ chatStore.selectedChat.association?.permissions }}
    <tpu-overline>User Ranks for Chat</tpu-overline>
    {{
      chatStore.selectedChat.users.find(
        (assoc) => assoc.userId === chatStore.selectedChat!.association!.userId
      )?.ranks
    }}
    <template
      v-for="rank in chatStore.selectedChat.users.find(
        (assoc) => assoc.userId === chatStore.selectedChat!.association!.userId
      )?.ranksMap"
      :key="rank"
    >
      <p>
        {{
          chatStore.selectedChat.ranks.find((r) => r.id === rank)?.name ||
          "Unknown? Sync issue?"
        }}
        - {{ rank }}
      </p>
    </template>
    <tpu-overline>Emoji</tpu-overline>
    {{
      chatStore.emoji.filter(
        (emoji) => emoji.chatId === chatStore.selectedChat!.id
      )?.length
    }}
    emoji in global store
    <tpu-overline>Other</tpu-overline>
    <p>chatId: {{ chatStore.selectedChat.id }}</p>
    <p>associationId: {{ chatStore.selectedChat.association!.id }}</p>
    <p>unread: {{ chatStore.unread }}</p>
    <p>group type: {{ chatStore.selectedChat.type }}</p>
    <p v-if="realUsers!.length">Real users: {{ realUsers!.length }}</p>
    <p v-if="chatStore.selectedChat.messages">Chat loaded</p>
    <p v-else>Chat not loaded</p>
    <p v-if="chatStore.selectedChat.id.toString().startsWith('-')">
      Pre-Colubrina migrate group
    </p>
  </div>
</template>

<script setup lang="ts">
import TpuOverline from "@/components/Framework/Typography/TpuOverline.vue";

import { useChatStore } from "@/stores/chat.store";
import { computed } from "vue";

const chatStore = useChatStore();

const realUsers = computed(() => chatStore.selectedChat?.users);
</script>
