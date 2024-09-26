<template>
  <chat-dev-options v-if="$chat.dialogs.chatDevOptions.value" />
  <WorkspaceDeleteDialog
    v-model="dialogs.delete.value"
    title="Delete Message"
    @submit="
      deleteMessage(dialogs.delete.message?.id);
      dialogs.delete.value = false;
    "
  />
  <div
    class="chat-container"
    @dragover="dragDropHandler"
    @drop="dragDropHandler"
  >
    <v-menu
      v-model="$chat.dialogs.emojiMenu.value"
      :attach="$chat.dialogs.emojiMenu.bindingElement"
      style="margin-left: 60px; z-index: 99999"
      height="60px"
      content-class="force-bg"
    >
      <v-card color="toolbar" width="100%" class="no-border">
        <div
          v-if="$chat.dialogs.emojiMenu.emoji"
          class="justify-items-center align-content-center width flex-row"
          style="width: 100%"
        >
          <v-card-title class="mt-n1">
            :{{ $chat.dialogs.emojiMenu.emoji.name }}:
          </v-card-title>
          <v-card-subtitle class="mt-n3">
            {{
              $chat.dialogs.emojiMenu.chat
                ? $chat.chatName($chat.dialogs.emojiMenu.chat)
                : "Private group"
            }}
          </v-card-subtitle>
        </div>
      </v-card>
    </v-menu>
    <v-navigation-drawer
      v-if="$vuetify.display.mobile"
      v-model="$chat.dialogs.message.value"
      color="card"
      :floating="true"
      location="bottom"
      :temporary="true"
      :touchless="true"
    >
      <message-actions-list
        v-if="$chat.dialogs.message.message"
        @delete="
          $event
            ? deleteMessage($chat.dialogs.message.message?.id)
            : confirmDelete($chat.dialogs.message.message);
          $chat.dialogs.message.value = false;
        "
        @edit="
          handleEdit({
            id: $chat.dialogs.message.message?.id || 0,
            content: $chat.dialogs.message.message?.content || ''
          });
          $chat.dialogs.message.value = false;
        "
        @reply="
          replyId = $chat.dialogs.message.message?.id;
          $chat.dialogs.message.value = false;
        "
      />
    </v-navigation-drawer>
    <v-menu v-else v-model="$chat.dialogs.message.value" :style="menuStyle">
      <message-actions-list
        @delete="
          $event
            ? deleteMessage($chat.dialogs.message.message?.id)
            : confirmDelete($chat.dialogs.message.message);
          $chat.dialogs.message.value = false;
        "
        @edit="
          handleEdit({
            id: $chat.dialogs.message.message?.id || 0,
            content: $chat.dialogs.message.message?.content || ''
          });
          $chat.dialogs.message.value = false;
        "
        @reply="
          replyId = $chat.dialogs.message.message?.id;
          $chat.dialogs.message.value = false;
        "
      />
    </v-menu>
    <div
      id="chat"
      :key="chatId"
      class="messages communications position-relative"
      @scroll="scrollEvent"
    >
      <div id="sentinel-bottom" ref="sentinelBottom" />
      <infinite-loading
        v-if="messages && $chat.loadNew"
        :identifier="`${$chat.selectedChat?.id}-${$chat.loadNew}-bottom`"
        @infinite="$chat.loadHistory($event, ScrollPosition.Bottom)"
      >
        <template #spinner>
          <div class="text-center">
            <v-progress-circular
              :size="36"
              :width="2"
              indeterminate
              :model-value="1"
            />
          </div>
        </template>
        <template #complete>
          <span />
        </template>
      </infinite-loading>
      <message-perf
        v-for="(message, index) in messages"
        :id="'message-id-' + message.id"
        :ref="`message-${index}`"
        :unread-id="unreadId"
        :key="message.id"
        :uncollapse-blocked="expandBlocked"
        class="mr-2 ml-2"
        :style="{ zIndex: 1000 - index }"
        :class="{
          'message-jumped': message.id === replyId,
          'message-mention': message.content.includes(`<@${$user.user?.id}>`)
        }"
        :date-separator="dateSeparator(index)"
        :editing="editing === message.id"
        @update:uncollapse-blocked="expandBlocked = $event"
        :editing-text="editingText"
        :merge="$chat.merge(message, index, chatId)"
        :message="message"
        :index="index"
        @author-click="handleAuthorClick($event, message.user.username)"
        @delete="
          $event.shifting
            ? deleteMessage($event.message.id)
            : confirmDelete($event.message)
        "
        @edit="handleEdit"
        @edit-message="doEditMessage"
        @edit-text="editingText = $event"
        @jump-to-message="$chat.jumpToMessage($event, chatId)"
        @reply="replyId = $event.id"
      />
      <v-skeleton-loader
        v-for="index in 20"
        v-if="!$chat.selectedChat?.messages?.length && $chat.loading"
        :key="index"
        type="list-item-avatar-three-line"
        color="background no-border"
      />
      <infinite-loading
        v-if="$messages.currentMessages"
        direction="top"
        :top="true"
        :identifier="`${$chat.selectedChat?.id}-${$chat.loadNew}`"
        :value="'bottom'"
        @infinite="$chat.loadHistory"
      >
        <template #spinner>
          <div class="text-center">
            <v-progress-circular
              :size="36"
              :width="2"
              indeterminate
              :model-value="1"
            />
          </div>
        </template>
        <template #complete>
          <div class="text-center">
            <PromoNoContent
              icon="mdi-message-processing-outline"
              :title="`Welcome to the start of ${$chat.chatName(
                $chat.selectedChat
              )}!`"
              description="Send a message to start the conversation!"
            />
          </div>
        </template>
      </infinite-loading>
      <div v-if="$chat.isReady" id="sentinel" ref="sentinel"></div>
    </div>
    <div class="input-container">
      <v-toolbar
        v-if="$chat.loadNew || avoidAutoScroll"
        class="pointer unselectable pl-2 force-bg dynamic-background"
        color="toolbar"
        height="25"
        style="
          border-radius: 20px 20px 0 0;
          font-size: 14px;
          backdrop-filter: blur(10px);
        "
        @click="jumpToBottom"
      >
        <v-icon class="mr-1 ml-1" size="17">mdi-arrow-down</v-icon>
        {{ $t("chats.jumpToBottom") }}
      </v-toolbar>
      <v-toolbar
        v-if="replyId"
        class="pointer px-3"
        color="card"
        height="35"
        style="opacity: 0.95"
        @click="jumpToBottom"
      >
        <RiReplyLine class="mr-3" />
        <UserAvatar
          :user="$user.users[replying?.userId]"
          class="mr-2"
          size="24"
        />
        {{ replying?.content }}
        <v-spacer />
        <v-btn @click="replyId = null">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-toolbar v-if="files.length" color="card" height="auto">
        <v-slide-group class="my-2 mx-1">
          <v-slide-group-item
            v-for="(file, index) in files"
            :key="file.name + file.size + index"
          >
            <v-card class="mr-2" elevation="0" max-width="400px">
              <v-progress-linear
                :color="finished ? 'success' : 'primary'"
                :model-value="file.uploadProgress"
                height="20"
              >
                <small>{{ uploadProgress }}%</small>
              </v-progress-linear>
              <v-toolbar>
                <v-icon class="ml-2">mdi-upload</v-icon>
                <v-card-text class="text-center limit">
                  {{ file.name }}
                </v-card-text>
                <v-spacer />
                <v-card-actions>
                  <v-btn
                    class="mr-2"
                    color="error"
                    @click="files.splice(index, 1)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-toolbar>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-toolbar>
      <CommunicationsInput
        ref="input"
        v-model="message"
        class="message-input user-content"
        style="margin-top: auto; z-index: 1001"
        :blocked="blocked"
        :editing="false"
        :active="active"
        @emoji="
          message += $event;
          $nextTick(() => focusInput());
        "
        @file-upload="uploadHandle"
        @paste="handlePaste"
        @quick-t-p-u-link="handleQuickTPULink"
        @send-message="sendMessage"
        @focus-input="focusInput"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  watch,
  computed,
  nextTick
} from "vue";
import CommunicationsInput from "@/components/Communications/Input.vue";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";
import User from "@/views/User/User.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import GalleryPreview from "@/components/Gallery/GalleryPreview.vue";
import WorkspaceDeleteDialog from "@/components/Workspaces/Dialogs/Delete.vue";
import MobileMenu from "@/components/Core/Dialogs/MobileMenu.vue";
import MessageActionsList from "@/components/Communications/MessageActionsList.vue";
import MessagePerf from "@/components/Communications/MessagePerf.vue";
import UserCard from "@/components/Users/UserCard.vue";
import InfiniteLoading from "@/components/Scroll/InfiniteScroll.vue";
import "v3-infinite-loading/lib/style.css";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";
import ChatDevOptions from "@/components/Dev/Dialogs/ChatDevOptionsDialog.vue";
import AccessibleTransition from "@/components/Core/AccessibleTransition.vue";
import Pins from "@/components/Communications/Menus/Pins.vue";
import {
  RiPushpin2Line,
  RiPushpinLine,
  RiReplyLine,
  RiSearchLine,
  RiUserFill,
  RiUserLine
} from "@remixicon/vue";
import { Chat, Message, ScrollPosition, UserStoredStatus } from "@/gql/graphql";
import { Platform } from "@/store/app.store";
import { IpcChannels } from "@/electron-types/ipc";
import functions from "@/plugins/functions";
import { RailMode } from "@/store/progressive.store";
import { useChatStore } from "@/store/chat.store";
import { useUserStore } from "@/store/user.store";
import { useMessagesStore } from "@/store/message.store";

const props = defineProps({
  chatId: {
    type: Number,
    required: true
  }
});

const resizeObserver = ref<ResizeObserver | null>(null);
const unreadId = ref(0);
const expandBlocked = ref(false);
const setup = ref(false);
const messageObserver = ref<IntersectionObserver | undefined>(undefined);
const messageBottomObserver = ref<IntersectionObserver | undefined>(undefined);
const previousScrollHeight = ref(0);
const message = ref("");
const avoidAutoScroll = ref(false);
const avoidAutoScrollSince = ref(0);
const editing = ref<number | undefined>(undefined);
const editingText = ref<string | undefined>(undefined);
const replyId = ref<number | undefined>(undefined);
const observer = ref<MutationObserver | undefined>(undefined);
const renderKey = ref(false);
const typingStatus = reactive({
  rateLimit: null as number | null
});
const files = ref(
  [] as {
    file: File;
    name: string;
    size: number;
    type: string;
    tpuLink: string | undefined;
    uploadProgress: number;
    finished: boolean;
  }[]
);
const uploadProgress = ref(0);
const uploading = ref(false);
const dialogs = reactive({
  delete: {
    value: false,
    message: undefined as Message | undefined
  }
});
const limit = ref(false);
const inputHeight = ref(87);
const embedFails = ref(
  [] as {
    data: { chatId: any; id: any; embeds: any };
    retries: number;
  }[]
);
const unread = ref(0);
const active = ref(false);

const chatStore = useChatStore();
const messagesStore = useMessagesStore();
const userStore = useUserStore();

const chat = computed(() => {
  return chatStore.chats.find((chat) => chat.association.id === props.chatId);
});

const messages = computed(() => {
  return messagesStore.messages[props.chatId];
});

const name = computed(() => chat.value?.name);

const blocked = computed(() => {
  const blockedUser = userStore.blocked.find(
    (block) => block.blockedUserId === chat.value?.recipient?.id
  );
  return blockedUser
    ? { value: true, you: true }
    : userStore.users[chat.value?.recipient?.id]?.blocked
    ? { value: true, you: false }
    : { value: false, you: false };
});

const ScrollPosition = ScrollPosition;

const height = computed(() => {
  const navbar = document.getElementById("navbar");
  if (!navbar) return "calc(100vh)";
  return "calc(100vh - " + navbar.offsetHeight + "px)";
});

const menuStyle = computed(() => {
  let offset = 0;
  const chatDialogsMessage = chatStore.dialogs.message;
  if (chatDialogsMessage?.message?.userId === userStore.user?.id) {
    offset += 48;
  }
  if (
    chatDialogsMessage?.message?.userId === userStore.user?.id ||
    chatStore.hasPermission("DELETE_MESSAGES")
  ) {
    offset += 48;
  }
  if (chatDialogsMessage.message && chatStore.hasPermission("PIN_MESSAGES")) {
    offset += 48;
  }
  return `position: absolute; top: ${
    chatDialogsMessage.y + window.scrollY + 211 + offset <
    useVuetify().display.height
      ? chatDialogsMessage.y + window.scrollY
      : useVuetify().display.height - 211 - offset
  }px; left: ${chatDialogsMessage.x + window.scrollX}px;`;
});

const uploadFileHeight = computed(() => (files.value.length > 0 ? 84 : 0));
const replyingHeight = computed(() => (replyId.value ? 35 : 0));

const replying = computed(() => {
  return messages.value?.find((message) => message.id === replyId.value);
});

const finished = computed(() => {
  if (!files.value.length) return true;
  return !!files.value.filter((file) => file.finished).length;
});

watch(name, (val) => {
  useApp().title = val;
});

watch(
  () => props.chatId,
  (val, oldVal) => {
    unread.value = chat.value?.unread || 0;
    chatStore.setDraft(oldVal, message.value);
    message.value = chatStore.getDraft(val.toString()) || "";
    files.value = [];
    replyId.value = undefined;
    focusInput();
    autoScroll();
    nextTick(() => {
      autoScroll();
    });
  }
);

watch(
  () => chatStore.isReady,
  () => {
    avoidAutoScroll.value = false;
    nextTick(() => {
      autoScroll();
    });

    if (unread.value) {
      const lastReadMessage = messages.value?.find(
        (message) => message.id === chat.value?.association?.lastRead
      );
      const nextMessageIndex = messages.value?.indexOf(lastReadMessage) - 1;

      if (nextMessageIndex !== -1) {
        unreadId.value = messages.value?.[nextMessageIndex]?.id;
      } else if (lastReadMessage) {
        unreadId.value = lastReadMessage?.id;
      }
    }
  }
);

watch(message, () => {
  const userStatus = userStore.user.storedStatus;
  if (userStatus === UserStoredStatus.Invisible) return;

  if (message.value.length > 0) {
    if (!typingStatus.rateLimit || typingStatus.rateLimit < Date.now()) {
      // useSockets().chat.emit("typing", chat.value?.association?.id);
      typingStatus.rateLimit = Date.now() + 2000;
    }
  } else {
    // useSockets().chat.emit("cancelTyping", chat.value?.association?.id);
    typingStatus.rateLimit = null;
  }
});

watch(replyId, () => {
  focusInput();
  nextTick(() => {
    autoScroll();
  });
});

onUnmounted(() => {
  if (!useExperiments().experiments.REMOVE_LEGACY_SOCKET) {
    // useSockets().chat.off("message", onMessage);
    // useSockets().chat.off("typing", onTyping);
    // useSockets().chat.off("embedResolution", onEmbedResolution);
  }
});

// Define your other methods similarly using `ref` and `computed`
function autoScroll() {
  if (
    avoidAutoScroll.value &&
    new Date().getTime() - avoidAutoScrollSince.value > 500
  )
    return;

  if (!messages.value) return;

  const sentinelElem = sentinel.value;
  if (!sentinelElem) return;

  try {
    const messageEl = document.querySelector('[data-message-id="0"]');
    if (messageEl) resizeObserver.observe(messageEl);
  } catch (e) {
    console.error(e);
  }

  sentinelElem.scrollIntoView();
  nextTick(() => sentinelElem.scrollIntoView());
}

// Handle the scroll event in the chat
function scrollEvent() {
  const cached = avoidAutoScroll.value;
  const elem = document.getElementById("chat");
  if (!elem) return;

  const scrollPos = elem.scrollTop;
  avoidAutoScroll.value = scrollPos < -300;

  if (avoidAutoScroll.value && !cached) {
    avoidAutoScrollSince.value = new Date().getTime();
  } else if (!avoidAutoScroll.value && cached) {
    avoidAutoScrollSince.value = 0;
  }
}

// Edit the last message sent by the user
function editLastMessage() {
  const lastMessage = messages.value
    .slice()
    .find((message) => message.userId === userStore.user.id);
  if (!lastMessage || lastMessage.id === editing.value) return;

  editingText.value = lastMessage.content;
  editing.value = lastMessage.id;
  nextTick(() => autoScroll());
}

// Focus the input area
function focusInput() {
  inputRef.value?.focus();
}

async function jumpToBottom() {
  this.avoidAutoScroll = false;
  if (this.$chat.loadNew) {
    this.$chat.setChat(this.chat?.association.id);
    this.$chat.loadNew = false;
  }
  this.autoScroll();
}

// Handle keyboard shortcuts
function shortcutHandler(e) {
  if (e.ctrlKey && e.key === "ArrowDown" && e.shiftKey) {
    e.preventDefault();
    if (!editing.value) return;
    const message = messages.value
      .slice()
      .reverse()
      .find(
        (message) =>
          message.id !== editing.value &&
          message.userId === userStore.user.id &&
          message.id > editing.value
      );
    if (!message) {
      editing.value = undefined;
      return;
    }
    editing.value = message.id;
    editingText.value = message.content;
    return;
  }

  if (e.ctrlKey && e.key === "ArrowUp" && !e.shiftKey) {
    e.preventDefault();
    const message = messages.value
      .slice()
      .find((message) => (replyId.value ? message.id < replyId.value : true));
    if (!message) {
      replyId.value = undefined;
      return;
    }
    replyId.value = message.id;
    return;
  }

  if (e.ctrlKey && e.key === "ArrowDown" && !e.shiftKey) {
    e.preventDefault();
    if (!replyId.value) return;
    const message = messages.value
      .slice()
      .reverse()
      .find((message) => (replyId.value ? message.id > replyId.value : true));
    if (!message) {
      replyId.value = undefined;
      return;
    }
    replyId.value = message.id;
    return;
  }

  if (
    e.ctrlKey &&
    (e.key === "v" || (e.key === "a" && editingText.value.length)) &&
    e.target.tagName !== "INPUT" &&
    e.target.tagName !== "TEXTAREA"
  ) {
    focusInput();
  }

  if (e.ctrlKey && e.key === "f") {
    e.preventDefault();
    chatStore.search.value = !chatStore.search.value;
  }

  if (e.metaKey || e.ctrlKey) return;

  if (e.key === "ArrowUp" && !editingText.value.length) {
    e.preventDefault();
    return editLastMessage();
  }

  if (e.key === "Escape") {
    if (replyId.value) {
      replyId.value = undefined;
      return;
    }
    if (chatStore.search.value) {
      chatStore.search.value = false;
      return;
    }
    autoScroll();
  }

  if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
    focusInput();
  }
}

// Event listener for message updates
async function onMessage(message) {
  if (message.chat.id !== chatStore.chat?.id) return;
  autoScroll();
}

// Handle author click event
async function handleAuthorClick(event, username) {
  if (!chatStore.dialogs.userMenu.value) {
    chatStore.dialogs.userMenu.user = await userStore.getUser(username);
    chatStore.dialogs.userMenu.bindingElement = event.bindingElement;
    chatStore.dialogs.userMenu.x = event.x;
    chatStore.dialogs.userMenu.y = event.y;
    chatStore.dialogs.userMenu.location = event.location || "top";
    chatStore.dialogs.userMenu.value = true;
  }
}

// On component mount
onMounted(() => {
  window.addEventListener("resize", autoScroll);
  window.addEventListener("focus", () => chatStore.readChat());
  window.addEventListener("keydown", shortcutHandler);
});
</script>

<style>
.chat-container {
  display: flex;
  flex-direction: column;
  height: v-bind(height);
  width: 100%;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  outline: none;
}

.input-container {
  position: sticky;
  bottom: 0;
}
</style>
