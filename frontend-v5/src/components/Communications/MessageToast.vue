<template>
  <a
    :href="`/communications/${
      chatStore.chats.find((chat) => chat.id === message!.chatId)?.association
        ?.id
    }`"
    @click.prevent
    class="relative flex"
  >
    <div class="flex justify-center items-center">
      <user-avatar size="50" :user-id="message!.userId" />
    </div>
    <div style="max-width: 200px; max-height: 50px" class="text-ellipsis ml-2">
      <p>
        {{ message?.content }}
      </p>
      <small>
        - {{ user?.username }} &bullet;
        {{ chatStore.lookupChat(message!.chatId)?.name }}
      </small>
    </div>
  </a>
</template>

<script lang="ts" setup>
import type { Message } from "@/gql/graphql";
import { useUserStore } from "@/stores/user.store";
import { computed } from "vue";
import { useChatStore } from "@/stores/chat.store";
import UserAvatar from "@/components/User/UserAvatar.vue";

const userStore = useUserStore();
const chatStore = useChatStore();
const props = defineProps({
  message: {
    type: Object as () => Message
  }
});

const user = computed(() => {
  if (!props.message?.userId)
    return {
      username: "?",
      avatar: null
    };
  return userStore.users[props.message.userId];
});
</script>
