<template>
  <div class="communications">
    <div
      class="messages position-relative"
      :key="chatStore.selectedChatAssociationId"
    >
      <div id="sentinel-bottom" ref="sentinelBottom"></div>
      <CommsMessage
        :unread-id="0"
        class="mr-2 ml-2"
        v-for="(message, index) in messagesStore.messages[
          chatStore.selectedChatAssociationId
        ] || []"
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
        @reply="replyId = $event"
        :merge="$chat.merge(message, index)"
      />
    </div>
    <div class="input mx-4 my-2">
      <card v-if="replyId" :padding="false" class="p-3 flex justify-between">
        <message-reply
          :line="false"
          :reply="
            messagesStore.selected.find((message) => message.id === replyId)
          "
        />
        <tpu-button
          icon
          variant="passive"
          style="width: 20px"
          @click="replyId = undefined"
        >
          <RiCloseLine style="width: 40px" />
        </tpu-button>
      </card>
      <comms-input
        v-model="content"
        ref="input"
        @keydown.enter.exact="sendMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat.store";
import { computed, onMounted, onUnmounted, ref, nextTick } from "vue";
import dayjs from "@/plugins/dayjs";
import CommsMessage from "@/components/Communications/CommsMessage.vue";
import CommsInput from "@/components/Communications/CommsInput.vue";
import { useUserStore } from "@/stores/user.store";
import { Chat, Message, MessageType } from "@/gql/graphql";
import { useSocket } from "@/boot/socket.service";
import { useMessagesStore } from "@/stores/messages.store";
import Card from "@/components/Framework/Card/Card.vue";
import MessageReply from "@/components/Communications/MessageReply.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import { useAppStore } from "@/stores/app.store";

const chatStore = useChatStore();
const userStore = useUserStore();
const messagesStore = useMessagesStore();

const replyId = ref<number | undefined>(undefined);
const editing = ref<number | undefined>(undefined);
const editingText = ref("");
const content = ref("");
const input = ref<InstanceType<typeof CommsInput> | null>(null);
const avoidAutoScroll = ref(false);
const appStore = useAppStore();

function dateSeparator(index: number) {
  const message = messagesStore.selected[index];
  const previousMessage = messagesStore.selected[index + 1];
  return !dayjs(message?.createdAt).isSame(previousMessage?.createdAt, "day");
}

const height = computed(() => {
  return "calc(100vh - 64px)";
});

async function sendMessage() {
  focusInput();
  let message = content.value.trim();
  if (!message.length) return;

  // this system appends the IDs of the emojis to the message for backend parsing.
  // messages without :emoji-name:uuid: will not be turned into emojis.
  const emojiRegex = /:[\w~-]+:/g;
  message = message.replace(emojiRegex, (match) => {
    try {
      const name = match.split(":")[1].split(":")[0];
      const emoji = chatStore.emoji.find((emoji) => emoji.name === name);
      if (!emoji) throw Error("");
      return `:${name}:${emoji.id}:`;
    } catch {
      return match;
    }
  });
  const replyIdPersistent = replyId.value;
  content.value = "";
  replyId.value = undefined;
  const tempId = new Date().getTime();
  const chatIndex = chatStore.chats.findIndex(
    (c) => c.id === chatStore.selectedChat?.id
  );
  const attachments: string[] = [];
  messagesStore.selected.unshift({
    chat: chatStore.selectedChat!,
    updatedAt: undefined,
    content: message,
    createdAt: new Date().toISOString(),
    user: userStore.users[userStore.user?.id],
    id: tempId,
    chatId: chatStore.selectedChat!.id,
    type: MessageType.Message,
    embeds: [],
    edited: false,
    replyId: replyId.value,
    readReceipts: [],
    pinned: false,
    userId: userStore.user?.id,
    emoji: chatStore.emoji,
    pending: true,
    error: false
  });
  if (chatIndex && chatIndex !== -1) {
    const chatToMove = chatStore.chats[chatIndex];
    chatStore.chats = [
      chatToMove,
      ...chatStore.chats.slice(0, chatIndex),
      ...chatStore.chats.slice(chatIndex + 1)
    ];
  }

  try {
    await messagesStore.sendMessage(message, attachments, replyIdPersistent);
  } catch (e) {
    const messageIndex = messagesStore.selected.findIndex(
      (message) => message.id === tempId
    );
    if (messageIndex === -1 || !chatStore.selectedChat) return;
    messagesStore.selected[messageIndex].pending = false;
    messagesStore.selected[messageIndex].error = true;
  }
}

function focusInput() {
  input.value?.input?.input?.focus();
}

function editLastMessage() {
  // find first message made by user
  const lastMessage = messagesStore.selected
    .slice()
    .find((message) => message.userId === userStore.user?.id);
  if (!lastMessage || lastMessage.id === editing.value) return;
  editingText.value = lastMessage.content;
  editing.value = lastMessage.id;
  nextTick(() => {
    autoScroll();
  });
}

function shortcutHandler(e: KeyboardEvent) {
  if (e.key === "Escape") {
    e.preventDefault();
    replyId.value = undefined;
  } else if (e.ctrlKey && e.key === "ArrowUp") {
    e.preventDefault();
    e.stopPropagation();
    // edit next message
    const message = messagesStore.selected
      .slice()
      .find((message) => (replyId.value ? message.id < replyId.value : true));
    if (!message) {
      replyId.value = undefined;
      return;
    }
    replyId.value = message.id;
  } else if (e.ctrlKey && e.key === "ArrowDown") {
    e.preventDefault();
    if (!replyId.value) return;
    // edit last message
    const message = messagesStore.selected
      .slice()
      .reverse()
      .find((message) => (replyId.value ? message.id > replyId.value : true));
    if (!message) {
      replyId.value = undefined;
      return;
    }
    replyId.value = message.id;
    return;
  } else if (
    (e.key === "v" && e.ctrlKey) ||
    (e.target?.tagName !== "INPUT" &&
      e.target?.tagName !== "TEXTAREA" &&
      !e.ctrlKey)
  ) {
    focusInput();
  }
}

function autoScroll() {
  if (avoidAutoScroll.value) return;
  if (!messagesStore.selected.length) return;
  const sentinel = document.getElementById("sentinel-bottom");
  if (!sentinel) return;
  sentinel.scrollIntoView();
  nextTick(() => {
    sentinel.scrollIntoView();
  });
}

function onMessage(message: { message: Message; chat: Chat }) {
  if (message.message.id !== chatStore.selectedChat?.id) return;
  autoScroll();
}

onMounted(() => {
  document.addEventListener("keydown", shortcutHandler);
  useSocket.chat.on("message", onMessage);
});

onUnmounted(() => {
  document.removeEventListener("keydown", shortcutHandler);
  useSocket.chat.on("message", onMessage);
});
</script>

<style scoped>
.communications {
  display: flex;
  flex-direction: column;
  height: v-bind(height);
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}

.input-container {
  position: sticky;
  bottom: 0;
}
</style>
