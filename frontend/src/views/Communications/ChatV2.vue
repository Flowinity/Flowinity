<template>
  <chat-dev-options v-if="$chat.dialogs.chatDevOptions.value" />
  <WorkspaceDeleteDialog
    title="Delete Message"
    v-model="dialogs.delete.value"
    @submit="
      deleteMessage(dialogs.delete.message?.id);
      dialogs.delete.value = false;
    "
  />
  <div class="container">
    <v-menu
      :attach="$chat.dialogs.emojiMenu.bindingElement"
      v-model="$chat.dialogs.emojiMenu.value"
      style="margin-left: 60px; z-index: 99999"
      height="60px"
      content-class="force-bg"
    >
      <v-card color="toolbar" width="100%" class="no-border">
        <div
          class="justify-items-center align-content-center width flex-row"
          style="width: 100%"
          v-if="$chat.dialogs.emojiMenu.emoji"
        >
          <v-card-title class="mt-n1">
            :{{ $chat.dialogs.emojiMenu.emoji.name }}:
          </v-card-title>
          <v-card-subtitle class="mt-n3">
            {{
              $chat.dialogs.emojiMenu.chat
                ? $chat.getChatName($chat.dialogs.emojiMenu.chat)
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
      class="messages communications position-relative"
      id="chat"
      @scroll="scrollEvent"
      :key="$chat.selectedChatId"
    >
      <div id="sentinel-bottom" ref="sentinelBottom" />
      <infinite-loading
        @infinite="$chat.loadHistory($event, ScrollPosition.Bottom)"
        :identifier="`${$chat.selectedChat?.id}-${$chat.loadNew}-bottom`"
        v-if="$chat.selectedChat?.messages && $chat.loadNew"
      >
        <template v-slot:spinner>
          <div class="text-center">
            <v-progress-circular
              :size="36"
              :width="2"
              indeterminate
              :model-value="1"
            />
          </div>
        </template>
        <template v-slot:complete>
          <span />
        </template>
      </infinite-loading>
      <message-perf
        :unread-id="unreadId"
        @update:uncollapse-blocked="expandBlocked = $event"
        :uncollapse-blocked="expandBlocked"
        class="mr-2 ml-2"
        v-for="(message, index) in $messages.currentMessages"
        :id="'message-id-' + message.id"
        :ref="`message-${index}`"
        :style="{ zIndex: 1000 - index }"
        :key="message.id"
        :class="{
          'message-jumped': message.id === replyId,
          'message-mention': message.content.includes(`<@${$user.user?.id}>`)
        }"
        :date-separator="dateSeparator(index)"
        :editing="editing === message.id"
        :editingText="editingText"
        :merge="$chat.merge(message, index)"
        :message="message"
        :index="index"
        @authorClick="handleAuthorClick($event, message.user.username)"
        @delete="
          $event.shifting
            ? deleteMessage($event.message.id)
            : confirmDelete($event.message)
        "
        @edit="handleEdit"
        @editMessage="doEditMessage"
        @editText="editingText = $event"
        @jumpToMessage="$chat.jumpToMessage($event)"
        @reply="replyId = $event.id"
      />
      <v-skeleton-loader
        v-if="!$chat.selectedChat?.messages?.length && $chat.loading"
        v-for="index in 20"
        :key="index"
        type="list-item-avatar-three-line"
        color="background no-border"
      />
      <infinite-loading
        @infinite="$chat.loadHistory"
        direction="top"
        :top="true"
        :identifier="`${$chat.selectedChat?.id}-${$chat.loadNew}`"
        v-if="$chat.selectedChat?.messages"
        :value="'bottom'"
      >
        <template v-slot:spinner>
          <div class="text-center">
            <v-progress-circular
              :size="36"
              :width="2"
              indeterminate
              :model-value="1"
            />
          </div>
        </template>
        <template v-slot:complete>
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
      <div id="sentinel" ref="sentinel" v-if="$chat.isReady"></div>
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
        class="pointer"
        color="card"
        height="35"
        style="opacity: 0.95"
        @click="jumpToBottom"
      >
        <v-icon class="mr-2 ml-3">mdi-reply</v-icon>
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
        class="message-input"
        style="margin-top: auto; z-index: 1001"
        @emoji="
          message += $event;
          $nextTick(() => focusInput());
        "
        @fileUpload="uploadHandle"
        @paste="handlePaste"
        @quickTPULink="handleQuickTPULink"
        @sendMessage="sendMessage"
        @focusInput="focusInput"
        :blocked="blocked"
        :editing="false"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import CommunicationsInput from "@/components/Communications/Input.vue";
import { MessageSocket } from "@/types/messages";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";
import User from "@/views/User/User.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { Typing } from "@/models/chat";
import GalleryPreview from "@/components/Gallery/GalleryPreview.vue";
import WorkspaceDeleteDialog from "@/components/Workspaces/Dialogs/Delete.vue";
import MobileMenu from "@/components/Core/Dialogs/MobileMenu.vue";
import MessageActionsList from "@/components/Communications/MessageActionsList.vue";
import MessagePerf from "@/components/Communications/MessagePerf.vue";
import UserCard from "@/components/Users/UserCard.vue";
import InfiniteLoading from "@/components/Scroll/InfiniteScroll.vue";
import "v3-infinite-loading/lib/style.css";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";
import { Chat, Message, ScrollPosition } from "@/gql/graphql";
import ChatDevOptions from "@/components/Dev/Dialogs/ChatDevOptionsDialog.vue";

export default defineComponent({
  components: {
    ChatDevOptions,
    PromoNoContent,
    MessageActionsList,
    MobileMenu,
    WorkspaceDeleteDialog,
    GalleryPreview,
    UserAvatar,
    User,
    MessageSkeleton,
    CommunicationsInput,
    MessagePerf,
    UserCard,
    InfiniteLoading
  },
  data() {
    return {
      resizeObserver: null as ResizeObserver | null,
      unreadId: 0,
      expandBlocked: false,
      setup: false,
      messageObserver: undefined as IntersectionObserver | undefined,
      messageBottomObserver: undefined as IntersectionObserver | undefined,
      previousScrollHeight: 0,
      message: "",
      avoidAutoScroll: false,
      avoidAutoScrollSince: 0,
      editing: undefined as number | undefined,
      editingText: undefined as string | undefined,
      replyId: undefined as number | undefined,
      observer: undefined as MutationObserver | undefined,
      renderKey: false,
      typingStatus: {
        rateLimit: null as number | null
      },
      files: [] as {
        file: File;
        name: string;
        size: number;
        type: string;
        tpuLink: string | undefined;
        uploadProgress: number;
        finished: boolean;
      }[],
      uploadProgress: 0,
      uploading: false,
      dialogs: {
        delete: {
          value: false,
          message: undefined as Message | undefined
        }
      },
      focusInterval: undefined as ReturnType<typeof setTimeout> | undefined,
      limit: false,
      inputHeight: 87,
      embedFails: [] as {
        data: { chatId: any; id: any; embeds: any };
        retries: number;
      }[],
      unread: 0
    };
  },
  computed: {
    name() {
      return this.$chat.selectedChat?.name;
    },
    blocked(): { value: boolean; you: boolean } {
      return this.$user.blocked.find(
        (block) =>
          block.blockedUserId === this.$chat.selectedChat?.recipient?.id
      )
        ? {
            value: true,
            you: true
          }
        : this.$user.users[this.$chat.selectedChat?.recipient?.id]?.blocked
          ? {
              value: true,
              you: false
            }
          : { value: false, you: false };
    },
    ScrollPosition() {
      return ScrollPosition;
    },
    height() {
      const navbar = document.getElementById("navbar");
      if (!navbar) return "calc(100vh)";
      return "calc(100vh - " + navbar.offsetHeight + "px)";
    },
    menuStyle() {
      let offset = 0;
      if (this.$chat.dialogs.message?.message?.userId === this.$user.user?.id) {
        offset += 48;
      }
      if (
        this.$chat.dialogs.message?.message?.userId === this.$user.user?.id ||
        this.$chat.hasPermission("DELETE_MESSAGES")
      ) {
        offset += 48;
      }
      if (
        this.$chat.dialogs.message.message &&
        this.$chat.hasPermission("PIN_MESSAGES")
      ) {
        offset += 48;
      }
      return `
        position: absolute;
        top: ${
          this.$chat.dialogs.message.y + window.scrollY + 211 + offset <
          this.$vuetify.display.height
            ? this.$chat.dialogs.message.y + window.scrollY
            : this.$vuetify.display.height - 211 - offset
        }px;
        left: ${this.$chat.dialogs.message.x + window.scrollX}px;`;
    },
    uploadFileHeight() {
      if (this.files.length > 0) return 84;
      return 0;
    },
    replyingHeight() {
      if (this.replyId) return 35;
      return 0;
    },
    replying() {
      return this.$messages.currentMessages?.find(
        (message) => message.id === this.replyId
      );
    },
    finished() {
      if (!this.files.length) return true;
      return !!this.files.filter((file) => file.finished).length;
    }
  },
  methods: {
    dateSeparator(index: number) {
      const message = this.$messages.currentMessages[index];
      const previousMessage = this.$messages.currentMessages[index + 1];
      return !this.$date(message?.createdAt).isSame(
        previousMessage?.createdAt,
        "day"
      );
    },
    confirmDelete(message: Message | undefined | null) {
      if (!message) return;
      this.dialogs.delete.message = message;
      this.dialogs.delete.value = true;
    },
    handleQuickTPULink(e: {
      media_formats: { gif: { url: string } };
      attachment: string;
    }) {
      if (!e.attachment) {
        this.message = e.media_formats?.gif.url;
        this.sendMessage();
        return;
      }
      this.message = this.$app.domain + e.attachment;
      this.sendMessage();
    },
    async handlePaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      if (items) {
        //@ts-ignore
        for (const item of items) {
          if (item.kind === "file") {
            e.preventDefault();
            const file = item.getAsFile();
            if (file) {
              this.files.push({
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                tpuLink: undefined,
                uploadProgress: 0,
                finished: false
              });
            }
          }
        }
        this.uploadFiles();
      }
    },
    async uploadHandle(e: FileList) {
      if (e.length > 0) {
        //@ts-ignore
        for (const file of e) {
          this.files.push({
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            tpuLink: undefined,
            uploadProgress: 0
          });
        }
        this.uploadFiles();
      }
    },
    async dragDropHandler(e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        //@ts-ignore
        for (const file of files) {
          this.files.push({
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            tpuLink: undefined,
            uploadProgress: 0
          });
        }
        this.uploadFiles();
      }
    },
    async uploadFiles() {
      if (this.files.length > 0) {
        if (this.uploading) return;
        this.uploading = true;
        const formData = new FormData();
        for (const file of this.files.filter((file) => !file.tpuLink)) {
          formData.append("attachments", file.file);
        }
        try {
          const { data } = await this.axios.post(`/gallery/site`, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            },
            onUploadProgress: (progressEvent) => {
              this.uploadProgress = Math.round(
                (progressEvent.loaded / (progressEvent.total || 0)) * 100
              );
              this.files.forEach((file) => {
                if (!file.tpuLink) {
                  file.uploadProgress = this.uploadProgress;
                }
              });
            }
          });
          this.files.forEach((file, index) => {
            file.tpuLink = data[index]?.upload?.attachment;
            file.finished = true;
          });
          this.uploading = false;
        } catch {
          this.files = [];
        }
      } else {
        this.uploading = false;
      }
    },
    async doEditMessage() {
      if (!this.editingText?.length) {
        return this.deleteMessage(this.editing!);
      }
      const emojiRegex = /(?:^|[^:\w~-]):[\w~-]+:(?![\w~-])/g;
      this.editingText = this.editingText.replace(emojiRegex, (match) => {
        try {
          const name = match.split(":")[1].split(":")[0];
          const emoji = this.$chat.emoji.find((emoji) => emoji.name === name);
          return `:${name}:${emoji.id}:`;
        } catch {
          return match;
        }
      });
      await this.axios.put(
        `/chats/${this.$chat.selectedChat?.association?.id}/message`,
        {
          id: this.editing,
          content: this.editingText
        }
      );
      this.editing = undefined;
      this.editingText = undefined;
      this.focusInput();
    },
    handleEdit(event: { id: number | undefined; content: string }) {
      if (!event.id) {
        this.editing = undefined;
        this.editingText = undefined;
        this.focusInput();
      } else {
        this.editing = event.id;
        this.editingText = event.content;
      }
    },
    async jumpToBottom() {
      this.avoidAutoScroll = false;
      if (this.$chat.loadNew) {
        this.$chat.setChat(this.$chat.selectedChat?.association.id);
        this.$chat.loadNew = false;
      }
      this.autoScroll();
    },
    async deleteMessage(id: number | undefined) {
      if (!id) return;
      await this.axios.delete(
        `/chats/${this.$chat.selectedChat?.association?.id}/messages/${id}`
      );
    },
    async sendMessage() {
      this.focusInput();
      if (this.unreadId) this.unreadId = 0;
      if (!this.$messages.currentMessages) return;
      if (!this.message && !this.files.length) return;
      if (!this.finished) return;
      let message = this.message.trim();

      // this system appends the IDs of the emojis to the message for backend parsing.
      // messages without :emoji-name:uuid: will not be turned into emojis.
      const emojiRegex = /:[\w~-]+:/g;
      message = message.replace(emojiRegex, (match) => {
        try {
          const name = match.split(":")[1].split(":")[0];
          const emoji = this.$chat.emoji.find((emoji) => emoji.name === name);
          return `:${name}:${emoji.id}:`;
        } catch {
          return match;
        }
      });
      if (!this.message && this.files.length) message = " ";
      const replyId = this.replyId;
      const attachments = this.files.map((file) => file.tpuLink);
      this.message = "";
      const tempId = new Date().getTime();
      const chatIndex = this.$chat.chats.findIndex(
        (c) => c.id === this.$chat.selectedChat?.id
      );
      this.$messages.currentMessages.unshift({
        content: message,
        createdAt: new Date().toISOString(),
        user: this.$user.user,
        pending: true,
        id: tempId,
        chatId: 0,
        updatedAt: new Date().toISOString(),
        type: "MESSAGE",
        embeds: [],
        edited: false,
        replyId: replyId,
        reply: this.replying,
        readReceipts: [],
        pinned: false,
        userId: this.$user.user?.id,
        emoji: this.$chat.emoji
      });
      this.replyId = undefined;
      this.files = [];
      this.autoScroll();

      // move chat to top
      if (chatIndex && chatIndex !== -1) {
        const chatToMove = this.$chat.chats[chatIndex];
        this.$chat.chats.splice(chatIndex, 1);
        this.$chat.chats.unshift(chatToMove);
      }

      this.$chat.setDraft(<string>this.$route.params.chatId, "");

      try {
        await this.$chat.sendMessage(message, attachments, replyId);
      } catch (e) {
        const messageIndex = this.$messages.currentMessages.findIndex(
          (message) => message.id === tempId
        );
        if (
          messageIndex === -1 ||
          messageIndex === undefined ||
          !this.$chat.selectedChat
        )
          return;
        this.$messages.currentMessages[messageIndex].pending = false;
        this.$messages.currentMessages[messageIndex].error = true;
      }
    },
    autoScroll() {
      if (
        this.avoidAutoScroll &&
        new Date().getTime() - this.avoidAutoScrollSince > 500
      )
        return;
      if (!this.$messages.currentMessages) return;
      const sentinel = document.getElementById("sentinel-bottom");
      if (!sentinel) return;
      try {
        if (this.$refs[`message-0`][0]?.$el) {
          this.resizeObserver.observe(this.$refs[`message-0`][0]?.$el);
        }
      } catch (e) {
        console.log(e);
      }
      sentinel.scrollIntoView();
      this.$nextTick(() => {
        sentinel.scrollIntoView();
      });
    },
    async scrollEvent() {
      const cached = this.avoidAutoScroll;
      const elem = document.getElementById("chat");
      if (!elem) return;
      const scrollPos = elem.scrollTop;
      this.avoidAutoScroll = scrollPos < -300;
      if (this.avoidAutoScroll && !cached) {
        this.avoidAutoScrollSince = new Date().getTime();
      } else if (!this.avoidAutoScroll && cached) {
        this.avoidAutoScrollSince = 0;
      }
    },
    editLastMessage() {
      // find first message made by user
      const lastMessage = this.$messages.currentMessages
        .slice()
        .find((message) => message.userId === this.$user.user?.id);
      if (!lastMessage || lastMessage.id === this.editing) return;
      this.editingText = lastMessage.content;
      this.editing = lastMessage.id;
      this.$nextTick(() => {
        this.autoScroll();
      });
    },
    focusInput() {
      this.$refs.input?.$refs?.textarea?.focus();
    },
    shortcutHandler(e: any) {
      if (e.ctrlKey && e.key === "ArrowUp" && e.shiftKey) {
        e.preventDefault();
        if (!this.editing) return this.editLastMessage();
        // edit next message
        const message = this.$messages.currentMessages
          .slice()
          .find(
            (message) =>
              message.id !== this.editing &&
              message.userId === this.$user.user?.id &&
              message.id < this.editing
          );
        if (!message) {
          this.editing = undefined;
          return;
        }
        this.editing = message.id;
        this.editingText = message.content;
        return;
      }
      if (e.ctrlKey && e.key === "ArrowDown" && e.shiftKey) {
        e.preventDefault();
        if (!this.editing) return;
        // edit last message
        const message = this.$messages.currentMessages
          .slice()
          .reverse()
          .find(
            (message) =>
              message.id !== this.editing &&
              message.userid === this.$user.user?.id &&
              message.id > this.editing
          );
        if (!message) {
          this.editing = undefined;
          return;
        }
        this.editing = message.id;
        this.editingText = message.content;
        return;
      }
      if (e.ctrlKey && e.key === "ArrowUp" && !e.shiftKey) {
        e.preventDefault();
        // edit next message
        const message = this.$messages.currentMessages
          .slice()
          .find((message) => (this.replyId ? message.id < this.replyId : true));
        if (!message) {
          this.replyId = undefined;
          return;
        }
        this.replyId = message.id;
        return;
      }
      if (e.ctrlKey && e.key === "ArrowDown" && !e.shiftKey) {
        e.preventDefault();
        if (!this.replyId) return;
        // edit last message
        const message = this.$messages.currentMessages
          .slice()
          .reverse()
          .find((message) => (this.replyId ? message.id > this.replyId : true));
        if (!message) {
          this.replyId = undefined;
          return;
        }
        this.replyId = message.id;
        return;
      }
      if (
        e.ctrlKey &&
        e.key === "v" &&
        e.target.tagName !== "INPUT" &&
        e.target.tagName !== "TEXTAREA" &&
        e.target.tagName !== "DIV"
      ) {
        this.focusInput();
      }
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        this.$chat.search.value = !this.$chat.search.value;
      }
      if (e.metaKey || e.ctrlKey) return;
      if (e.key === "ArrowUp" && !this.message.length) {
        e.preventDefault();
        return this.editLastMessage();
      }
      if (
        e.target.tagName === "INPUT" &&
        e.target.tagName === "TEXTAREA" &&
        e.target.tagName === "DIV"
      )
        return;
      if (e.key === "Escape") {
        if (this.unreadId) this.unreadId = 0;
        if (this.replyId) return (this.replyId = undefined);
        if (this.$chat.search.value) {
          this.$chat.search.value = false;
          return;
        }
        this.jumpToBottom();
      }
      if (
        e.target.tagName !== "INPUT" &&
        e.target.tagName !== "TEXTAREA" &&
        e.target.tagName !== "DIV"
      ) {
        this.focusInput();
      }
    },
    async onMessage(message: MessageSocket) {
      if (message.chat.id !== this.$chat.selectedChat?.id) return;
      const findMessage = this.$messages.currentMessages.findIndex(
        (m) => m.content === message.message.content && m.pending
      );
      if (findMessage !== -1) {
        if (this.$messages.currentMessages)
          this.$messages.currentMessages[findMessage] = message.message;
        this.autoScroll();
        this.$chat.readChat();
        return;
      }
      await this.$messages.currentMessages.unshift(message.message);
      if (document.hasFocus()) {
        this.$chat.readChat();
      } else {
        if (message.message.userId !== this.$user.user?.id) this.$chat.sound();
      }
      this.autoScroll();
    },
    onTyping(data: Typing) {
      if (!data) return;
      const chat =
        this.$chat.chats[
          this.$chat.chats.findIndex((c: Chat) => c.id === data.chatId)
        ];
      if (!chat) return;
      if (!chat.typers) chat.typers = [];
      chat.typers =
        chat.typers?.filter((t: Typing) => t.userId !== data.userId) || [];
      chat.typers.push(data);
      setTimeout(() => {
        chat.typers =
          chat.typers?.filter(
            (t: Typing) =>
              t.userId !== data.userId &&
              this.$date(t.expires).isAfter(Date.now())
          ) || [];
      }, 5000);
    },
    onCancelTyping(data: Typing) {
      const chat =
        this.$chat.chats[
          this.$chat.chats.findIndex((c: Chat) => c.id === data.chatId)
        ];
      if (!chat && !chat.typers) return;
      chat.typers =
        chat.typers?.filter((t: Typing) => t.userId !== data.userId) || [];
    },
    onEmbedResolution(data: { chatId: any; id: any; embeds: any }) {
      const index = this.$chat.chats.findIndex(
        (c: Chat) => c.id === data.chatId
      );
      if (index === -1) return;
      const associationId = this.$chat.chats[index]?.association?.id;
      const messages = this.$messages.messages[associationId];
      if (!messages) return;
      const messageIndex = messages.findIndex((m: Message) => m.id === data.id);
      if (messageIndex === -1) {
        let embedFailIndex = this.embedFails.findIndex(
          (e) => e.data.id === data.id
        );
        if (embedFailIndex === -1) {
          this.embedFails.push({
            data,
            retries: 0
          });
          embedFailIndex = this.embedFails.length - 1;
        }
        if (this.embedFails[embedFailIndex]?.retries > 5) {
          this.embedFails.splice(embedFailIndex, 1);
          return;
        }
        setTimeout(() => {
          this.onEmbedResolution(data);
        }, 50);
        this.embedFails[embedFailIndex].retries++;
        return;
      }
      messages[messageIndex].embeds = data.embeds;
      this.autoScroll();
    },
    onFocus() {
      if (document.hasFocus()) {
        this.$chat.readChat();
      }
    },
    onResize() {
      console.info("[TPU/ChatObserver] Resized");
      this.autoScroll();
      this.$nextTick(() => {
        if (!this.avoidAutoScroll) this.autoScroll();
      });
    },
    async handleAuthorClick(event, username) {
      if (this.$chat.dialogs.userMenu.value === false) {
        this.$chat.dialogs.userMenu.user = await this.$user.getUser(username);
        this.$chat.dialogs.userMenu.bindingElement = event.bindingElement;
        this.$chat.dialogs.userMenu.x = event.x;
        this.$chat.dialogs.userMenu.y = event.y;
        this.$chat.dialogs.userMenu.location = event.location || "top";
        this.$chat.dialogs.userMenu.value = true;
      }
    }
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(this.onResize);
    document.body.classList.add("disable-overscroll");
    document.addEventListener("keydown", this.shortcutHandler);
    this.focusInterval = setInterval(this.onFocus, 2000);
    // re-enable auto scroll for flex-direction: column-reverse;
    this.$sockets.chat.on("message", this.onMessage);
    this.$sockets.chat.on("embedResolution", this.onEmbedResolution);
    this.$sockets.chat.on("typing", this.onTyping);
    this.$sockets.chat.on("cancelTyping", this.onCancelTyping);
    this.message = this.$chat.getDraft(<string>this.$route.params.chatId) || "";
    this.$app.railMode = "communications";
  },
  unmounted() {
    this.unread = 0;
    document.body.classList.remove("disable-overscroll");
    this.$chat.isReady = 0;
    this.$chat.setDraft(<string>this.$route.params.chatId, this.message);
    document.removeEventListener("keydown", this.shortcutHandler);
    document
      .querySelector(".message-input")
      ?.removeEventListener("resize", this.onResize);
    clearInterval(this.focusInterval);
    this.$sockets.chat.off("message", this.onMessage);
    this.$sockets.chat.off("typing", this.onTyping);
    this.$sockets.chat.off("embedResolution", this.onEmbedResolution);
  },
  watch: {
    name(val) {
      this.$app.title = val;
    },
    "$route.params.chatId"(val, oldVal) {
      this.unread = this.$chat.selectedChat?.unread;
      this.$chat.setDraft(oldVal, this.message);
      this.message = this.$chat.getDraft(val) || "";
      this.files = [];
      this.replyId = undefined;
      this.focusInput();
      this.autoScroll();
      this.$nextTick(() => {
        this.autoScroll();
      });
    },
    "$chat.isReady"() {
      this.avoidAutoScroll = false;
      this.$nextTick(() => {
        this.autoScroll();
      });

      if (this.unread) {
        const lastReadMessage = this.$messages.currentMessages?.find(
          (message) =>
            message.id === this.$chat.selectedChat?.association?.lastRead
        );
        const nextMessageIndex =
          this.$messages.currentMessages?.indexOf(lastReadMessage) - 1;

        if (nextMessageIndex !== -1) {
          this.unreadId =
            this.$messages.currentMessages?.[nextMessageIndex]?.id;
        } else if (lastReadMessage) {
          this.unreadId = lastReadMessage?.id;
        }
      }
    },
    message() {
      if (this.message.length > 0) {
        if (
          !this.typingStatus.rateLimit ||
          this.typingStatus.rateLimit < Date.now()
        ) {
          this.$sockets.chat.emit(
            "typing",
            this.$chat.selectedChat?.association?.id
          );
          this.typingStatus.rateLimit = Date.now() + 2000;
        }
      } else {
        this.$sockets.chat.emit(
          "cancelTyping",
          this.$chat.selectedChat?.association?.id
        );
        this.typingStatus.rateLimit = null;
      }
    },
    replyId() {
      this.focusInput();
      this.$nextTick(() => {
        this.autoScroll();
      });
    }
  }
});
</script>

<style>
.container {
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
