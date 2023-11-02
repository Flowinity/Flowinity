<template>
  <div>
    <div v-for="chat in chatStore.chats" :key="chat.id">
      <SideBarItem :to="`/communications/${chat.association?.id}`">
        <template #icon>
          <user-avatar
            :username="chat.type === 'group' ? chat.name : undefined"
            :user-id="chat.type === 'direct' ? chat.recipient?.id : undefined"
            :src="
              chat.type === 'group' && chat.icon
                ? functions.avatar(chat)
                : undefined
            "
            :status="chat.type === 'direct'"
            :badge="chat.unread > 99 ? '99+' : chat.unread"
          ></user-avatar>
        </template>
        <template #title>
          {{ chatStore.chatName(chat) }}
        </template>
      </SideBarItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import functions from "@/plugins/functions";
import SideBarItem from "@/components/Framework/Navigation/SideBarItem.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { useChatStore } from "@/stores/chat.store";

const chatStore = useChatStore();
</script>

<style scoped></style>
