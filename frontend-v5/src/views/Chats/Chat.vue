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
    <div class="input mx-4 my-2">
      <comms-input v-model="content" ref="input" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat.store";
import { computed, ref, onMounted, onUnmounted } from "vue";
import dayjs from "@/plugins/dayjs";
import CommsMessage from "@/components/Communications/CommsMessage.vue";
import CommsInput from "@/components/Communications/CommsInput.vue";

const chatStore = useChatStore();

const replyId = ref<number | undefined>(undefined);
const editing = ref<number | undefined>(undefined);
const editingText = ref("");
const content = ref("");
const input = ref<InstanceType<typeof CommsInput> | null>(null);

function dateSeparator(index: number) {
  const message = chatStore.selectedChat?.messages[index];
  const previousMessage = chatStore.selectedChat?.messages[index + 1];
  return !dayjs(message?.createdAt).isSame(previousMessage?.createdAt, "day");
}

const height = computed(() => {
  const navbar = document.getElementById("appbar");
  if (!navbar) return "calc(100vh)";
  return "calc(100vh - " + navbar.offsetHeight + "px)";
});

function focusInput() {
  input.value?.input?.input?.focus();
}
function shortcutHandler(e: any) {
  if (
    e.target?.tagName !== "INPUT" &&
    e.target?.tagName !== "TEXTAREA" &&
    e.target?.tagName !== "DIV"
  ) {
    focusInput();
  }
}

onMounted(() => {
  document.addEventListener("keydown", shortcutHandler);
});

onUnmounted(() => {
  document.removeEventListener("keydown", shortcutHandler);
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
