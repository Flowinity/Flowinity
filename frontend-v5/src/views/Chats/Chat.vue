<template>
  <div class="flex h-full" id="outer-chat">
    <div class="communications flex-1" id="communications">
      <div
        class="messages position-relative"
        id="messages"
        :key="chatStore.selectedChatAssociationId"
        ref="messages"
      >
        <div id="sentinel-bottom" ref="sentinelBottom"></div>
        <comms-message
          :unread-id="0"
          class="mr-2 ml-2"
          v-for="(message, index) in messagesStore.messages[
            chatStore.selectedChatAssociationId
          ] || []"
          :id="'message-id-' + message.id"
          :ref="`message-${index}`"
          :key="message.id"
          :class="{
            'message-jumped': message.id === replyId,
            'message-mention': message.content?.includes(`<@${$user.user?.id}>`)
          }"
          :date-separator="dateSeparator(index)"
          :editing="editing === message.id"
          @update:editing="editing = $event"
          :message="message"
          :index="index"
          @reply="
            replyId = $event;
            replying = true;
          "
          @auto-scroll="autoScroll"
          :merge="$chat.merge(message, index)"
        />
      </div>
      <div class="input mx-4 my-2">
        <div class="flex-col">
          <comms-input
            v-model="content"
            ref="input"
            @keydown.enter.exact="sendMessage"
            @update:model-value="type"
            @send="sendMessage"
          >
            <div
              style="
                overflow: hidden;
                transition: max-height 0.05s ease-in;
                margin-bottom: -8px;
                max-height: 0;
              "
              :style="{
                'max-height': replying ? '36px' : '0'
              }"
            >
              <div class="flex w-full justify-between">
                <message-reply
                  :line="false"
                  :reply="
                    messagesStore.selected.find(
                      (message) => message.id === replyId
                    )
                  "
                />
                <tpu-button icon variant="passive" @click="replying = false">
                  <RiCloseLine style="width: 20px" />
                </tpu-button>
              </div>
            </div>
          </comms-input>
          <div class="flex justify-between text-sm mt-2">
            <div class="flex items-center">
              <div class="user-avatars">
                <user-avatar
                  v-for="typer in excludedTypers"
                  :user-id="typer.userId"
                  class="user-avatar"
                  :key="typer.userId"
                  size="20"
                />
              </div>
              <p
                class="text-medium-emphasis-dark ml-2"
                v-if="excludedTypers.length"
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
            <p
              class="text-medium-emphasis-dark"
              :class="{ 'text-red': content.length > 4000 }"
            >
              {{ content.length }}/4000
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="h-full">
      <second-side-bar
        class="top-0 relative h-full right-0 max-sm:hidden sidebar-transition"
        v-if="
          chatStore.uiOptions.memberSidebar || chatStore.uiOptions.searchSidebar
        "
        :width="chatStore.uiOptions.searchSidebar ? '384px' : '256px'"
      >
        <search-side-bar v-show="chatStore.uiOptions.searchSidebar" />
        <member-side-bar
          v-show="
            chatStore.uiOptions.memberSidebar &&
            !chatStore.uiOptions.searchSidebar &&
            !chatStore.uiOptions.pinSidebar
          "
        />
        <pins-side-bar v-show="chatStore.uiOptions.pinSidebar" />
      </second-side-bar>
    </div>
  </div>

  <teleport to="#appbar-options">
    <transition mode="out-in" name="slide-up" appear>
      <div class="flex gap-2">
        <comms-search-input
          ref="searchInput"
          v-model="chatStore.uiOptions.search"
          :placeholder="t('chats.search')"
          :style="{
            width: chatStore.uiOptions.searchSidebar ? '270px' : 'unset'
          }"
          @keydown.enter="chatStore.uiOptions.searchSidebar = true"
        />

        <tpu-button
          icon
          variant="passive"
          v-tooltip.bottom="
            chatStore.uiOptions.searchSidebar
              ? t('chats.searchSidebar.hide')
              : t('chats.searchSidebar.show')
          "
          @click="
            chatStore.uiOptions.pinSidebar = !chatStore.uiOptions.pinSidebar
          "
        >
          <RiPushpin2Line
            style="width: 20px"
            v-if="!chatStore.uiOptions.pinSidebar"
          />
          <RiPushpin2Fill style="width: 20px" v-else />
        </tpu-button>
        <tpu-button
          icon
          variant="passive"
          v-tooltip.bottom="
            chatStore.uiOptions.memberSidebar
              ? t('chats.memberSidebar.hide')
              : t('chats.memberSidebar.show')
          "
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
            style="width: 20px"
            v-if="
              !chatStore.uiOptions.memberSidebar ||
              chatStore.uiOptions.searchSidebar
            "
          />
          <RiUserFill style="width: 20px" v-else />
        </tpu-button>
      </div>
    </transition>
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
import TpuSpinner from "@/components/Framework/Spinner/TpuSpinner.vue";
import RiCheckLine from "vue-remix-icons/icons/ri-check-line.vue";
import RiUserLine from "vue-remix-icons/icons/ri-user-line.vue";
import RiUserFill from "vue-remix-icons/icons/ri-user-fill.vue";
import RiSearchLine from "vue-remix-icons/icons/ri-search-line.vue";
import RiSearchFill from "vue-remix-icons/icons/ri-search-fill.vue";
import SecondSideBar from "@/layouts/default/SecondSideBar.vue";
import MemberSideBar from "@/layouts/default/MemberSideBar.vue";
import SearchSideBar from "@/layouts/default/SearchSideBar.vue";
import { NewMessageSubscription } from "@/graphql/chats/subscriptions/newMessage.graphql";
import { useSubscription } from "@vue/apollo-composable";
import RiPushpin2Line from "vue-remix-icons/icons/ri-pushpin-2-line.vue";
import RiPushpin2Fill from "vue-remix-icons/icons/ri-pushpin-2-fill.vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import CommsSearchInput from "@/components/Communications/CommsSearchInput.vue";
import PinsSideBar from "@/layouts/default/PinsSideBar.vue";
const { t } = useI18n();
const chatStore = useChatStore();
const userStore = useUserStore();
const messagesStore = useMessagesStore();

const replyId = ref<number | undefined>(undefined);
const replying = ref(false);
const editing = ref<number | undefined>(undefined);
const content = ref("");
const input = ref<InstanceType<typeof CommsInput> | null>(null);
const avoidAutoScroll = ref(false);
const appStore = useAppStore();
const type = throttle(handleTyping, 1000);
const searchInput = ref<InstanceType<typeof TextField> | null>(null);

const messages = ref<HTMLElement | null>(null);

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
  const replyIdPersistent = replying.value ? replyId.value : undefined;
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
  editing.value = lastMessage.id;
  nextTick(() => {
    autoScroll();
  });
}

function shortcutHandler(e: KeyboardEvent) {
  if (e.key === "Escape") {
    e.preventDefault();
    if (chatStore.uiOptions.searchSidebar) {
      searchInput.value?.input?.blur();
      chatStore.uiOptions.search = "";
      return (chatStore.uiOptions.searchSidebar = false);
    }
    replying.value = false;
  } else if (editing.value) {
    return;
  } else if ((e.ctrlKey || e.metaKey) && e.key === "ArrowUp") {
    e.preventDefault();
    e.stopPropagation();
    if (replyId.value && !replying.value) {
      replyId.value = undefined;
    }
    const message = messagesStore.selected
      .slice()
      .find((message) => (replyId.value ? message.id < replyId.value : true));
    if (!message) {
      replying.value = false;
      return;
    }
    replyId.value = message.id;
    replying.value = true;
  } else if ((e.ctrlKey || e.metaKey) && e.key === "ArrowDown") {
    e.preventDefault();
    if (!replyId.value) return;
    // edit last message
    const message = messagesStore.selected
      .slice()
      .reverse()
      .find((message) => (replyId.value ? message.id > replyId.value : true));
    if (!message) {
      replying.value = false;
      return;
    }
    replyId.value = message.id;
    replying.value = true;
    return;
  } else if (e.key === "ArrowUp" && !content.value.length) {
    e.preventDefault();
    e.stopPropagation();
    editLastMessage();
  } else if (
    e.target?.tagName !== "INPUT" &&
    e.target?.tagName !== "TEXTAREA" &&
    (!e.ctrlKey || (e.key === "v" && (e.ctrlKey || e.metaKey))) &&
    !e.target?.classList.contains("ProseMirror")
  ) {
    focusInput();
  } else if (e.ctrlKey && e.key === "f") {
    e.preventDefault();
    if (!chatStore.uiOptions.searchSidebar) {
      searchInput.value?.input?.focus();
    } else {
      chatStore.uiOptions.search = "";
      searchInput.value?.input?.blur();
    }
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

function onMessage(message: { message: Message; chat: Chat }) {
  if (message.message.id !== chatStore.selectedChat?.id) return;
  autoScroll();
}

onMounted(() => {
  document.addEventListener("keydown", shortcutHandler);
  useSubscription(NewMessageSubscription, {
    onSubscriptionData: (data) => {
      onMessage(data.subscriptionData.data.message);
    }
  });
  focusInput();
});

onUnmounted(() => {
  document.removeEventListener("keydown", shortcutHandler);
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
    focusInput();
  }
);

watch(
  () => messagesStore.messages[chatStore.selectedChatAssociationId]?.length,
  () => {
    nextTick(() => {
      autoScroll();
    });
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
