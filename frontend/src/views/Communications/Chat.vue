<template>
  <div
    id="chat"
    class="communications position-relative"
    @drop.prevent="dragDropHandler"
    @dragover.prevent
  >
    <v-navigation-drawer
      v-if="$vuetify.display.mobile"
      v-model="$chat.dialogs.message.value"
      color="card"
      :floating="true"
      location="bottom"
      :temporary="true"
      :touchless="true"
    >
      <MessageActionsList
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
      ></MessageActionsList>
    </v-navigation-drawer>
    <v-menu v-else v-model="$chat.dialogs.message.value" :style="menuStyle">
      <MessageActionsList
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
      ></MessageActionsList>
    </v-menu>
    <WorkspaceDeleteDialog
      v-model="dialogs.delete.value"
      title="Delete Message?"
      @submit="
        deleteMessage(dialogs.delete.message?.id);
        dialogs.delete.value = false;
      "
    />
    <ol
      id="chat-list"
      ref="messageList"
      class="message-list-container"
      :style="{ height }"
      @scroll="scrollEvent"
    >
      <div id="sentinel-bottom" ref="sentinelBottom" v-if="$chat.isReady"></div>
      <template v-if="!$chat.selectedChat?.messages?.length && !$chat.loading">
        <v-row align="center" justify="center">
          <v-col cols="12" md="6" class="text-center">
            <UserAvatar
              :chat="$chat.selectedChat?.recipient ? null : $chat.selectedChat"
              :status="true"
              :user="$chat.selectedChat?.recipient"
              class="ml-4"
              size="64"
            />
            <v-card-title
              class="grey--text unselectable"
              v-if="$chat.selectedChat?.recipient?.username"
              style="text-overflow: inherit; white-space: normal"
            >
              {{
                $t("chats.start.dm", {
                  username: $chat.selectedChat?.recipient?.username
                })
              }}
            </v-card-title>
            <v-card-title
              class="grey--text unselectable"
              v-else-if="$chat.selectedChat?.name"
              style="text-overflow: inherit; white-space: normal"
            >
              {{ $t("chats.start.group", { name: $chat.selectedChat?.name }) }}
            </v-card-title>
          </v-col>
        </v-row>
      </template>
      <MessagePerf
        class="mr-2 ml-2"
        v-for="(message, index) in $chat.selectedChat?.messages"
        :id="'message-' + index"
        :key="message.id"
        :class="{ 'replying-message': message.id === replyId }"
        :date-separator="dateSeparator(index)"
        :editing="editing === message.id"
        :editingText="editingText"
        :merge="$chat.merge(message, index)"
        :message="message"
        :index="index"
        @authorClick="
          $chat.dialogs.userMenu.user = $event.user;
          $chat.dialogs.userMenu.username = $event.user.username;
          $chat.dialogs.userMenu.bindingElement = $event.bindingElement;
          $chat.dialogs.userMenu.x = $event.x;
          $chat.dialogs.userMenu.y = $event.y;
          $chat.dialogs.userMenu.location = $event.location || 'top';
        "
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
      <div id="sentinel" ref="sentinel" v-if="$chat.isReady"></div>
    </ol>
    <v-fade-transition v-model="avoidAutoScroll">
      <v-toolbar
        v-if="avoidAutoScroll || $chat.loadingNew || $chat.loadNew"
        :style="`position: fixed; bottom: ${
          inputHeight +
          replyingHeight +
          uploadFileHeight +
          ($vuetify.display.mobile ? 43 : 0)
        }px`"
        class="pointer unselectable pl-2 pb-1 force-bg dynamic-background"
        color="transparent"
        height="25"
        style="
          border-radius: 20px 20px 0 0;
          font-size: 14px;
          z-index: 1001;
          backdrop-filter: blur(10px);
        "
        @click="jumpToBottom"
      >
        <template v-if="!$chat.loadingNew">
          <v-icon class="mr-1 ml-1" size="17">mdi-arrow-down</v-icon>
          {{ $t("chats.jumpToBottom") }}
        </template>
        <template v-else>
          <v-progress-circular
            :size="17"
            :width="2"
            class="mr-2"
            indeterminate
          ></v-progress-circular>
          {{ $t("chats.loading") }}
        </template>
      </v-toolbar>
    </v-fade-transition>
    <v-fade-transition v-model="replyId">
      <v-toolbar
        v-if="replyId"
        :style="
          `position: absolute; bottom: ${
            inputHeight + uploadFileHeight + ($vuetify.display.mobile ? 43 : 0)
          }px` + (!avoidAutoScroll ? '; border-radius: 20px 20px 0 0;' : '')
        "
        class="pointer"
        color="card"
        height="35"
        style="opacity: 0.95; z-index: 1001"
        @click="jumpToBottom"
      >
        <v-icon class="mr-2 ml-3">mdi-reply</v-icon>
        <UserAvatar :user="replying?.user" class="mr-2" size="24"></UserAvatar>
        {{ replying?.content }}
        <v-spacer></v-spacer>
        <v-btn @click="replyId = null">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
    </v-fade-transition>
    <v-fade-transition :model-value="files.length">
      <v-toolbar
        v-if="files.length"
        :style="
          `position: sticky; bottom: ${inputHeight}px` +
          (!avoidAutoScroll && !replyId
            ? '; border-radius: 20px 20px 0 0;'
            : '')
        "
        color="card"
        height="auto"
      >
        <v-slide-group class="my-2 mx-1">
          <v-slide-group-item
            v-for="(file, index) in files"
            :key="file.name + file.size + index"
          >
            <v-card class="mr-2" elevation="0" max-width="400px" show-arrows>
              <v-progress-linear
                :color="uploadProgress === 100 ? 'success' : 'primary'"
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
                <v-spacer></v-spacer>
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
    </v-fade-transition>
    <CommunicationsInput
      ref="input"
      v-model="message"
      class="message-input"
      style="margin-top: auto"
      @emoji="
        message += $event;
        $nextTick(() => focusInput());
      "
      @fileUpload="uploadHandle"
      @paste="handlePaste"
      @quickTPULink="handleQuickTPULink"
      @sendMessage="sendMessage"
      @focusInput="focusInput"
    ></CommunicationsInput>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import CommunicationsInput from "@/components/Communications/Input.vue";
import Message from "@/components/Communications/Message.vue";
import { MessageSocket } from "@/types/messages";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";
import User from "@/views/User/User.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { Chat, Typing } from "@/models/chat";
import GalleryPreview from "@/components/Gallery/GalleryPreview.vue";
import { Message as MessageType } from "@/models/message";
import WorkspaceDeleteDialog from "@/components/Workspaces/Dialogs/Delete.vue";
import MobileMenu from "@/components/Core/Dialogs/MobileMenu.vue";
import MessageActionsList from "@/components/Communications/MessageActionsList.vue";
import MessagePerf from "@/components/Communications/MessagePerf.vue";
import UserCard from "@/components/Users/UserCard.vue";

export default defineComponent({
  name: "Chat",
  components: {
    MessageActionsList,
    MobileMenu,
    WorkspaceDeleteDialog,
    GalleryPreview,
    UserAvatar,
    User,
    MessageSkeleton,
    Message,
    CommunicationsInput,
    MessagePerf,
    UserCard
  },
  data() {
    return {
      setup: false,
      messageObserver: undefined as IntersectionObserver | undefined,
      messageBottomObserver: undefined as IntersectionObserver | undefined,
      previousScrollHeight: 0,
      message: "",
      avoidAutoScroll: false,
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
      }[],
      uploadProgress: 0,
      uploading: false,
      dialogs: {
        delete: {
          value: false,
          message: undefined as MessageType | undefined
        }
      },
      focusInterval: undefined as ReturnType<typeof setTimeout> | undefined,
      limit: false,
      inputHeight: 87,
      embedFails: [] as {
        data: { chatId: any; id: any; embeds: any };
        retries: number;
      }[]
    };
  },
  computed: {
    height() {
      let string = `calc(100dvh - 56px - 103px`;
      if (this.$vuetify.display.mobile) string += " - 43px";
      if (this.replyId) string += " - 35px";
      if (this.files.length) string += " - 104.46px";
      string += ")";
      return string;
    },
    menuStyle() {
      return `
        position: absolute;
        top: ${
          this.$chat.dialogs.message.y + 190 < this.$vuetify.display.height
            ? this.$chat.dialogs.message.y
            : this.$vuetify.display.height - 230
        }px;
        left: ${this.$chat.dialogs.message.x}px;`;
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
      return this.$chat.selectedChat?.messages?.find(
        (message) => message.id === this.replyId
      );
    }
  },
  methods: {
    dateSeparator(index: number) {
      const message = this.$chat.selectedChat?.messages[index];
      const previousMessage = this.$chat.selectedChat?.messages[index + 1];
      return !this.$date(message?.createdAt).isSame(
        previousMessage?.createdAt,
        "day"
      );
    },
    confirmDelete(message: MessageType | undefined | null) {
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
        for (const item of items) {
          if (item.kind === "file") {
            const file = item.getAsFile();
            if (file) {
              this.files.push({
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                tpuLink: undefined,
                uploadProgress: 0
              });
            }
          }
        }
        this.uploadFiles();
      }
    },
    async uploadHandle(e: FileList) {
      if (e.length > 0) {
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
        });
        this.uploading = false;
      } else {
        this.uploading = false;
      }
    },
    async doEditMessage() {
      if (!this.editingText?.length) {
        return this.deleteMessage(this.editing!);
      }
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
        await this.$chat.loadHistory(null, true, true);
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
      if (!this.$chat.selectedChat?.messages) return;
      if (!this.message && !this.files.length) return;
      if (this.uploading) return;
      let message = this.message.trim();
      if (!this.message && this.files.length) message = " ";
      const replyId = this.replyId;
      const attachments = this.files.map((file) => file.tpuLink);
      this.message = "";
      const tempId = new Date().getTime();
      const index = await this.$chat.selectedChat?.messages.unshift({
        content: message,
        createdAt: new Date().toISOString(),
        user: this.$user.user,
        pending: true,
        id: tempId,
        chatId: 0,
        updatedAt: new Date().toISOString(),
        type: "message",
        embeds: [],
        edited: false,
        replyId: replyId,
        reply: this.replying,
        readReceipts: [],
        pinned: false
      });
      this.replyId = undefined;
      this.files = [];
      this.autoScroll();

      // move chat to top
      const chatIndex = this.$chat.chats.findIndex(
        (c) => c.id === this.$chat.selectedChat?.id
      );
      if (chatIndex && chatIndex !== -1) {
        const chatToMove = this.$chat.chats[chatIndex];
        this.$chat.chats.splice(chatIndex, 1);
        this.$chat.chats.unshift(chatToMove);
      }

      this.$chat.setDraft(<string>this.$route.params.chatId, "");

      try {
        await this.axios.post(`/chats/${this.$route.params.chatId}/message`, {
          content: message,
          replyId: replyId,
          attachments
        });
      } catch (e) {
        console.log(e);
        const messageIndex = this.$chat.selectedChat?.messages.findIndex(
          (message) => message.id === tempId
        );
        if (
          messageIndex === -1 ||
          messageIndex === undefined ||
          !this.$chat.selectedChat
        )
          return;
        this.$chat.selectedChat.messages[messageIndex].pending = false;
        this.$chat.selectedChat.messages[messageIndex].error = true;
      }
    },
    autoScroll() {
      if (this.avoidAutoScroll) return;
      if (!this.$chat.selectedChat?.messages) return;
      const sentinel = document.getElementById("sentinel-bottom");
      if (!sentinel) return;
      sentinel.scrollIntoView();
    },
    recordScrollPosition(mode = "top") {
      this.previousScrollHeight =
        mode === "top" ? this.$chat.selectedChat?.messages.length || 0 : 1;
    },
    restoreScrollPosition() {
      // TODO
    },
    setupIntersectionObserver() {
      this.setup = true;
      const options = {
        root: document.getElementById("chat-list"),
        rootMargin: "10px"
      };
      const bottomObserver = new IntersectionObserver(
        this.handleBottomIntersection,
        options
      );
      const topObserver = new IntersectionObserver(
        this.handleIntersection,
        options
      );
      const bottomSentinel = document.getElementById("sentinel-bottom");
      const topSentinel = document.getElementById("sentinel");
      if (bottomSentinel) bottomObserver.observe(bottomSentinel);
      if (topSentinel) topObserver.observe(topSentinel);
    },
    async handleIntersection(entries: IntersectionObserverEntry[]) {
      const entry = entries[0];
      console.log(entry);
      if (
        entry.isIntersecting &&
        !this.$chat.loadingNew &&
        !this.$chat.loading
      ) {
        console.info("[TPU/ChatSentinel/Top] Intersecting");
        this.recordScrollPosition();
        await this.$chat.loadHistory(undefined, undefined, true);
        await this.$nextTick();
        this.restoreScrollPosition();
        return true;
      } else {
        return false;
      }
    },
    async handleBottomIntersection(entries: IntersectionObserverEntry[]) {
      if (!this.$chat.loadNew) return;
      console.log(this.$chat.loadNew);
      const entry = entries[0];
      if (
        entry.isIntersecting &&
        !this.$chat.loadingNew &&
        !this.$chat.loading &&
        this.$chat.loadNew
      ) {
        this.recordScrollPosition("bottom");
        console.info("[TPU/ChatSentinel/Bottom] Intersecting");
        await this.$chat.loadHistory(undefined, undefined, false);
        await this.$nextTick();
        this.restoreScrollPosition();
        return true;
      } else {
        return false;
      }
    },
    async scrollEvent() {
      const elem = document.getElementById("chat-list");
      if (!elem) return;
      const scrollPos = elem.scrollTop;
      this.avoidAutoScroll = scrollPos < -300;
    },
    editLastMessage() {
      // find first message made by user
      const lastMessage = this.$chat.selectedChat?.messages
        .slice()
        .find((message) => message.tpuUser?.id === this.$user.user?.id);
      if (!lastMessage || lastMessage.id === this.editing) return;
      this.editingText = lastMessage.content;
      this.editing = lastMessage.id;
    },
    focusInput() {
      this.$refs.input?.$refs?.textarea?.focus();
    },
    shortcutHandler(e: any) {
      if (e.ctrlKey && e.key === "ArrowUp" && e.shiftKey) {
        e.preventDefault();
        if (!this.editing) return this.editLastMessage();
        // edit next messsge
        const message = this.$chat.selectedChat?.messages
          .slice()
          .find(
            (message) =>
              message.id !== this.editing &&
              message.tpuUser?.id === this.$user.user?.id &&
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
        // edit last messsge
        const message = this.$chat.selectedChat?.messages
          .slice()
          .reverse()
          .find(
            (message) =>
              message.id !== this.editing &&
              message.tpuUser?.id === this.$user.user?.id &&
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
        // edit next messsge
        const message = this.$chat.selectedChat?.messages
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
        // edit last messsge
        const message = this.$chat.selectedChat?.messages
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
      if (e.key === "ArrowUp" && !this.message.length && !this.editing) {
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
      const findMessage = this.$chat.selectedChat?.messages.findIndex(
        (m) => m.content === message.message.content && m.pending
      );
      if (findMessage !== -1) {
        if (this.$chat.selectedChat)
          this.$chat.selectedChat.messages[findMessage] = message.message;
        this.autoScroll();
        this.$chat.readChat();
        return;
      }
      await this.$chat.chats
        .find((c) => c.id === this.$chat.selectedChat?.id)
        ?.messages.unshift(message.message);
      if (document.hasFocus()) {
        this.$chat.readChat();
      } else {
        if (message.message.userId !== this.$user.user?.id) this.$chat.sound();
      }
      this.autoScroll();
    },
    onTyping(data: Typing) {
      const chat =
        this.$chat.chats[
          this.$chat.chats.findIndex((c: Chat) => c.id === data.chatId)
        ];
      if (!chat) return;
      if (!chat.typers) chat.typers = [];
      chat.typers = chat.typers.filter(
        (t: Typing) => t.user.id !== data.user.id
      );
      chat.typers.push(data);
      setTimeout(() => {
        chat.typers = chat.typers.filter(
          (t: Typing) =>
            t.user.id !== data.user.id &&
            this.$date(t.expires).isAfter(Date.now())
        );
      }, 5000);
    },
    onEmbedResolution(data: { chatId: any; id: any; embeds: any }) {
      const index = this.$chat.chats.findIndex(
        (c: Chat) => c.id === data.chatId
      );
      if (index === -1) return;
      if (!this.$chat.chats[index].messages) return;
      const messageIndex = this.$chat.chats[index].messages.findIndex(
        (m: MessageType) => m.id === data.id
      );
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
      this.$chat.chats[index].messages[messageIndex].embeds = data.embeds;
      this.autoScroll();
    },
    onFocus() {
      if (document.hasFocus()) {
        this.$chat.readChat();
      }
    },
    onResize(e: any) {
      console.info("[TPU/ChatObserver] Resized");
      this.$nextTick(() => {
        if (!this.avoidAutoScroll) this.autoScroll();
      });
    }
  },
  mounted() {
    document.body.classList.add("disable-overscroll");
    new ResizeObserver(this.onResize).observe(
      document.querySelector("#chat-list")
    );
    //document.querySelector(".message-list-container")?.addEventListener("scroll", this.scrollEvent);
    // add event listener for shortcuts
    document.addEventListener("keydown", this.shortcutHandler);
    this.focusInterval = setInterval(this.onFocus, 2000);
    // re-enable auto scroll for flex-direction: column-reverse;
    this.$socket.on("message", this.onMessage);
    this.$socket.on("embedResolution", this.onEmbedResolution);
    this.$socket.on("typing", this.onTyping);
    this.message = this.$chat.getDraft(<string>this.$route.params.chatId) || "";
    this.$app.railMode = "communications";
  },
  unmounted() {
    document.body.classList.remove("disable-overscroll");
    this.$chat.isReady = 0;
    this.$chat.setDraft(<string>this.$route.params.chatId, this.message);
    document.removeEventListener("scroll", this.scrollEvent);
    document.removeEventListener("keydown", this.shortcutHandler);
    document
      .querySelector(".message-input")
      ?.removeEventListener("resize", this.onResize);
    clearInterval(this.focusInterval);
    this.$socket.off("message", this.onMessage);
    this.$socket.off("typing", this.onTyping);
    this.$socket.off("embedResolution", this.onEmbedResolution);
  },
  watch: {
    "$route.params.chatId"(val, oldVal) {
      this.$chat.setDraft(oldVal, this.message);
      this.message = this.$chat.getDraft(val) || "";
      this.files = [];
      this.replyId = undefined;
      this.focusInput();
    },
    "$chat.isReady"() {
      this.avoidAutoScroll = false;
      this.$nextTick(() => {
        this.autoScroll();
        if (!this.setup) this.setupIntersectionObserver();
      });
    },
    message() {
      if (this.message.length > 0) {
        if (
          !this.typingStatus.rateLimit ||
          this.typingStatus.rateLimit < Date.now()
        ) {
          this.$socket.emit("typing", this.$chat.selectedChat?.association?.id);
          this.typingStatus.rateLimit = Date.now() + 3000;
        }
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
