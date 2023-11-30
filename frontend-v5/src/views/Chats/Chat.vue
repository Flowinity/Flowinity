<template>
  <div class="communications">
    <div
      :key="chatStore.selectedChatAssociationId"
      class="messages position-relative"
    >
      <div id="sentinel-bottom" ref="sentinelBottom"></div>
      <CommsMessage
        v-for="(message, index) in messagesStore.messages[
          chatStore.selectedChatAssociationId
        ] || []"
        :id="'message-id-' + message.id"
        :ref="`message-${index}`"
        :key="message.id"
        :unread-id="0"
        class="mr-2 ml-2"
        :style="{ zIndex: 1000 - index }"
        :class="{
          'message-jumped': message.id === replyId,
          'message-mention': message.content?.includes(`<@${$user.user?.id}>`)
        }"
        :date-separator="dateSeparator(index)"
        :editing="editing === message.id"
        :editing-text="editingText"
        :message="message"
        :index="index"
        :merge="$chat.merge(message, index)"
        @edit-text="editingText = $event"
        @reply="replyId = $event"
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
      <div class="flex-col">
        <comms-input
          ref="input"
          v-model="content"
          @keydown.enter.exact="sendMessage"
          @update:model-value="type"
        />
        <div class="flex justify-between">
          <div class="flex items-center">
            <div class="user-avatars">
              <UserAvatar
                v-for="typer in excludedTypers"
                :key="typer.userId"
                :user-id="typer.userId"
                class="user-avatar"
                size="20"
              />
            </div>
            <p
              v-if="excludedTypers.length"
              class="text-medium-emphasis-dark ml-2"
            >
              {{
                t(
                  "chats.typing",
                  {
                    users: excludedTypers
                      .map((typer) => userStore.users[typer.userId]?.username)
                      .join(", ")
                  },
                  excludedTypers.length > 1
                    ? 1
                    : excludedTypers.length > 5
                    ? 2
                    : 0
                )
              }}
            </p>
          </div>
          <p class="text-medium-emphasis-dark">{{ content.length }}/4000</p>
        </div>
      </div>
    </div>
  </div>

  <teleport to="#appbar-options">
    <transition mode="out-in" name="slide-up" appear>
      <div class="flex gap-2">
        <tpu-button
          v-tooltip.bottom="
            chatStore.uiOptions.searchSidebar
              ? t('chats.searchSidebar.hide')
              : t('chats.searchSidebar.show')
          "
          icon
          variant="passive"
          @click="
            chatStore.uiOptions.searchSidebar =
              !chatStore.uiOptions.searchSidebar
          "
        >
          <RiSearchLine
            v-if="!chatStore.uiOptions.searchSidebar"
            style="width: 20px"
          />
          <RiSearchFill v-else style="width: 20px" />
        </tpu-button>
        <tpu-button
          v-tooltip.bottom="
            chatStore.uiOptions.memberSidebar
              ? t('chats.memberSidebar.hide')
              : t('chats.memberSidebar.show')
          "
          icon
          variant="passive"
          @click="
            chatStore.uiOptions.searchSidebar &&
            chatStore.uiOptions.memberSidebar
              ? (chatStore.uiOptions.searchSidebar = false)
              : (chatStore.uiOptions.memberSidebar =
                  !chatStore.uiOptions.memberSidebar);
            chatStore.uiOptions.searchSidebar = false;
          "
        >
          <RiUserLine
            v-if="
              !chatStore.uiOptions.memberSidebar ||
              chatStore.uiOptions.searchSidebar
            "
            style="width: 20px"
          />
          <RiUserFill v-else style="width: 20px" />
        </tpu-button>
      </div>
    </transition>
  </teleport>

  <teleport to="#main-flex">
    <second-side-bar
      v-if="
        chatStore.uiOptions.memberSidebar || chatStore.uiOptions.searchSidebar
      "
      class="fixed top-0 left-0 max-sm:hidden sidebar-transition"
      :width="chatStore.uiOptions.searchSidebar ? '384px' : '256px'"
    >
      <search-side-bar v-show="chatStore.uiOptions.searchSidebar" />
      <member-side-bar
        v-show="
          chatStore.uiOptions.memberSidebar &&
          !chatStore.uiOptions.searchSidebar
        "
      />
    </second-side-bar>
  </teleport>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat.store";
import {
  computed,
  h,
  markRaw,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch
} from "vue";
import dayjs from "@/plugins/dayjs";
import CommsMessage from "@/components/Communications/CommsMessage.vue";
import CommsInput from "@/components/Communications/CommsInput.vue";
import { useUserStore } from "@/stores/user.store";
import { Chat, Message, MessageType, UserStoredStatus } from "@/gql/graphql";
import { useSocket } from "@/boot/socket.service";
import { useMessagesStore } from "@/stores/messages.store";
import Card from "@/components/Framework/Card/Card.vue";
import MessageReply from "@/components/Communications/MessageReply.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import { RailMode, useAppStore } from "@/stores/app.store";
import { throttle } from "lodash";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import RiAtFill from "vue-remix-icons/icons/ri-at-fill.vue";
import RiAtLine from "vue-remix-icons/icons/ri-at-line.vue";
import functions from "@/plugins/functions";
import RiUserLine from "vue-remix-icons/icons/ri-user-line.vue";
import RiUserFill from "vue-remix-icons/icons/ri-user-fill.vue";
import RiSearchLine from "vue-remix-icons/icons/ri-search-line.vue";
import RiSearchFill from "vue-remix-icons/icons/ri-search-fill.vue";
import SecondSideBar from "@/layouts/default/SecondSideBar.vue";
import MemberSideBar from "@/layouts/default/MemberSideBar.vue";
import SearchSideBar from "@/layouts/default/SearchSideBar.vue";

const { t } = useI18n();
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
const type = throttle(handleTyping, 1000);

const excludedTypers = computed(() => {
  return chatStore.typers.filter(
    (typer) => typer.userId !== userStore.user?.id
  );
});

function handleTyping() {
  if (userStore.user?.storedStatus === UserStoredStatus.Invisible) return;
  if (!chatStore.selectedChat) return;
  if (!content.value.length) {
    return chatStore.cancelType();
  } else {
    return chatStore.type();
  }
}

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
  console.log(e.target?.classList);
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
      !e.ctrlKey &&
      !e.target?.classList.contains("ProseMirror"))
  ) {
    focusInput();
  } else if (e.ctrlKey && e.key === "f") {
    e.preventDefault();
    chatStore.uiOptions.searchSidebar = !chatStore.uiOptions.searchSidebar;
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

const embedFails = [] as {
  data: { chatId: any; id: any; embeds: any };
  retries: number;
}[];

function onEmbedResolution(data: { chatId: any; id: any; embeds: any }) {
  console.log(data);
  if (data.chatId !== chatStore.selectedChat?.id) return;
  const messageIndex = messagesStore.messages[
    chatStore.selectedChat?.association?.id!
  ].findIndex((m: Message) => m.id === data.id);
  console.log(messageIndex);
  if (messageIndex === -1) {
    let embedFailIndex = embedFails.findIndex((e) => e.data.id === data.id);
    if (embedFailIndex === -1) {
      embedFails.push({
        data,
        retries: 0
      });
      embedFailIndex = embedFails.length - 1;
    }
    if (embedFails[embedFailIndex]?.retries > 5) {
      embedFails.splice(embedFailIndex, 1);
      return;
    }
    setTimeout(() => {
      onEmbedResolution(data);
    }, 50);
    embedFails[embedFailIndex].retries++;
    return;
  }
  messagesStore.messages[chatStore.selectedChat?.association?.id!][
    messageIndex
  ].embeds = data.embeds;
  autoScroll();

  nextTick(() => {
    autoScroll();
  });
}

function onMessage(message: { message: Message; chat: Chat }) {
  if (message.message.id !== chatStore.selectedChat?.id) return;
  autoScroll();
}

onMounted(() => {
  document.addEventListener("keydown", shortcutHandler);
  useSocket.chat.on("message", onMessage);
  useSocket.chat.on("embedResolution", onEmbedResolution);
});

onUnmounted(() => {
  document.removeEventListener("keydown", shortcutHandler);
  useSocket.chat.off("message", onMessage);
  useSocket.chat.off("embedResolution", onEmbedResolution);
});

const route = useRoute();

watch(
  () => [
    chatStore.selectedChat?.name,
    chatStore.selectedChat?.id,
    chatStore.selectedChat?.icon
  ],
  () => {
    const chat = chatStore.selectedChat;
    if (!chat) return;
    appStore.currentNavItem = {
      item: {
        name: chatStore.chatName(chat) || "Loading...",
        icon:
          chat.icon ||
          (chat.recipient && userStore.users[chat.recipient.id]?.avatar)
            ? h(UserAvatar, {
                username: chat.name,
                src: functions.avatar(chat),
                size: 32,
                style: "margin: 0px 4px 0px 4px"
              })
            : markRaw(RiAtLine),
        path: route.path,
        selectedIcon: markRaw(RiAtFill)
      },
      rail: [
        appStore.navigation.railOptions.find(
          (rail) => rail.id === RailMode.CHAT
        )
      ]
    };
  }
);
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
