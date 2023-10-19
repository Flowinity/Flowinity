<template>
  <div
    class="messages communications position-relative"
    :key="chatStore.selectedChatAssociationId"
  >
    <div id="sentinel-bottom" ref="sentinelBottom"></div>
    <CommsMessage
      :unread-id="0"
      class="mr-2 ml-2"
      v-for="(message, index) in chatStore.selectedChat?.messages"
      :id="'message-id-' + message.id"
      :ref="`message-${index}`"
      :style="{ zIndex: 1000 - index }"
      :key="message.id"
      :class="{
        'message-jumped': message.id === replyId,
        'message-mention': message.content?.includes(`<@${$user.user?.id}>`)
      }"
      :date-separator="dateSeparator(index)"
      :editing="editing === message.id"
      :editingText="editingText"
      :message="message"
      :index="index"
      @editText="editingText = $event"
      @reply="replyId = $event.id"
      :merge="$chat.merge(message, index)"
    />
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat.store";
import { ref } from "vue";
import dayjs from "@/plugins/dayjs";
import CommsMessage from "@/components/Communications/CommsMessage.vue";

const chatStore = useChatStore();

const replyId = ref<number | undefined>(undefined);
const editing = ref<number | undefined>(undefined);
const editingText = ref("");

function dateSeparator(index: number) {
  const message = chatStore.selectedChat?.messages[index];
  const previousMessage = chatStore.selectedChat?.messages[index + 1];
  return !dayjs(message?.createdAt).isSame(previousMessage?.createdAt, "day");
}
</script>

<style scoped></style>
