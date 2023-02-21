<template>
  <div id="chat" @drop.prevent="dragDropHandler" @dragover.prevent>
    <v-list
      color="transparent"
      bg-color="transparent"
      id="chat-list"
      class="message-list-container"
      :style="`height: calc(100vh - ${143 + replyingHeight}px)`"
      width="100%"
      style="overflow-x: hidden !important"
    >
      <Message
        v-for="(message, index) in $chat.selectedChat?.messages"
        :key="message.id"
        :message="message"
        :id="'message-' + index"
        :editing="editing === message.id"
        v-if="!$chat.loading"
        @edit="handleEdit"
        @editText="editingText = $event"
        :editingText="editingText"
        @editMessage="doEditMessage"
        @authorClick="
          $chat.dialogs.userMenu.value = false;
          $chat.dialogs.userMenu.user = $event.user;
          $chat.dialogs.userMenu.username = $event.user.username;
          $chat.dialogs.userMenu.bindingElement = $event.bindingElement;
          $chat.dialogs.userMenu.x = $event.x;
          $chat.dialogs.userMenu.y = $event.y;
          $chat.dialogs.userMenu.location = $event.location || 'top';
          $chat.dialogs.userMenu.value = true;
        "
        @reply="replyId = $event.id"
        :class="{ 'replying-message': message.id === replyId }"
      ></Message>
      <MessageSkeleton v-for="i in 30" v-if="$chat.loading"></MessageSkeleton>
    </v-list>
    <v-fade-transition v-model="avoidAutoScroll">
      <v-toolbar
        :style="`position: fixed; bottom: ${
          inputHeight + replyingHeight + uploadFileHeight
        }px`"
        height="25"
        style="border-radius: 20px 20px 0 0; font-size: 14px; z-index: 1"
        @click="forceBottomAmirite"
        class="pointer unselectable pl-2 pb-1"
        v-if="avoidAutoScroll"
        color="card"
      >
        <v-icon class="mr-1 ml-1" size="17">mdi-arrow-down</v-icon>
        Jump to bottom
      </v-toolbar>
    </v-fade-transition>
    <v-fade-transition v-model="replyId">
      <v-toolbar
        :style="
          `position: sticky; bottom: ${inputHeight + uploadFileHeight}px` +
          (!avoidAutoScroll ? '; border-radius: 20px 20px 0 0;' : '')
        "
        height="35"
        style="opacity: 0.95; z-index: 1"
        @click="forceBottomAmirite"
        class="pointer"
        v-if="replyId"
        color="card"
      >
        <v-icon class="mr-2 ml-3">mdi-reply</v-icon>
        <UserAvatar size="24" :user="replying?.user" class="mr-2"></UserAvatar>
        {{ replying?.content }}
      </v-toolbar>
    </v-fade-transition>
    <v-fade-transition :model-value="files.length">
      <v-toolbar
        :style="
          `position: sticky; bottom: ${inputHeight}px` +
          (!avoidAutoScroll && !replyId
            ? '; border-radius: 20px 20px 0 0;'
            : '')
        "
        v-if="files.length"
        height="auto"
        color="card"
      >
        <v-slide-group class="my-2 mx-1">
          <v-slide-group-item
            v-for="(file, index) in files"
            :key="file.name + file.size + index"
          >
            <v-card class="mr-2" show-arrows elevation="0" max-width="400px">
              <v-progress-linear
                :model-value="file.uploadProgress"
                :color="uploadProgress === 100 ? 'success' : 'primary'"
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
                    color="error"
                    @click="files.splice(index, 1)"
                    class="mr-2"
                    text
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
      v-model="message"
      @sendMessage="sendMessage"
      style="bottom: 0"
      ref="input"
      :renderKey="renderKey"
      class="message-input"
      @fileUpload="uploadHandle"
      @paste="handlePaste"
      @quickTPULink="handleQuickTPULink"
    ></CommunicationsInput>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import CommunicationsInput from "@/components/Communications/Input.vue";
import Message from "@/components/Communications/Message.vue";
import { MessageSocket } from "@/types/messages";
import { Message as MessageType } from "@/models/message";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";
import User from "@/views/User/User.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { ChatAssociation } from "@/models/chatAssociation";
import { Chat, Typing } from "@/models/chat";
import GalleryPreview from "@/components/Gallery/GalleryPreview.vue";
export default defineComponent({
  name: "Chat",
  components: {
    GalleryPreview,
    UserAvatar,
    User,
    MessageSkeleton,
    Message,
    CommunicationsInput
  },
  data() {
    return {
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
      uploading: false
    };
  },
  computed: {
    uploadFileHeight() {
      if (this.files.length > 0) return 84;
      return 0;
    },
    replyingHeight() {
      if (this.replyId) return 35;
      return 0;
    },
    replying() {
      return this.$chat.selectedChat?.messages.find(
        (message) => message.id === this.replyId
      );
    },
    inputHeight() {
      const lines = this.message.split("\n").length;
      return (lines - 1) * 24 + 86.5;
    }
  },
  methods: {
    handleQuickTPULink(e: { attachment: string }) {
      this.message = "https://i.troplo.com/i/" + e.attachment;
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
    forceBottomAmirite() {
      this.avoidAutoScroll = false;
      this.autoScroll();
    },
    async sendMessage() {
      if (!this.message && !this.files) return;
      if (!this.message) this.message = "[File]";
      if (this.uploading) return;
      const message = this.message;
      const replyId = this.replyId;
      const attachments = this.files.map((file) => file.tpuLink);
      this.message = "";
      this.renderKey = !this.renderKey;
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
        readReceipts: []
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
      const chat = document.getElementById("chat-list");
      if (chat) {
        chat.scrollTop = 0;
      }
    },
    scrollEvent() {
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
      if (!lastMessage) return;
      this.editingText = lastMessage.content;
      this.editing = lastMessage.id;
    },
    focusInput() {
      //@ts-ignore
      this.$refs.input?.$refs?.textarea?.focus();
    },
    shortcutHandler(e: any) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (e.key === "ArrowUp") {
        this.editLastMessage();
      }
      if (
        e.target.tagName === "INPUT" &&
        e.target.tagName === "TEXTAREA" &&
        e.target.tagName === "DIV"
      )
        return;
      if (e.key === "Escape") {
        if (this.replyId) return (this.replyId = undefined);
        this.forceBottomAmirite();
      }
      if (
        e.target.tagName !== "INPUT" &&
        e.target.tagName !== "TEXTAREA" &&
        e.target.tagName !== "DIV"
      ) {
        this.focusInput();
      }
    }
  },
  mounted() {
    //document.querySelector(".message-list-container")?.addEventListener("scroll", this.scrollEvent);
    // add event listener for shortcuts
    document.addEventListener("keydown", this.shortcutHandler);
    setInterval(() => {
      if (document.hasFocus()) {
        window.tpuInternals.readChat();
      }
    }, 2000);
    // re-enable auto scroll for flex-direction: column-reverse;
    document
      .querySelector(".message-list-container")
      ?.addEventListener("scroll", this.scrollEvent);
    this.$socket.on("message", async (message: MessageSocket) => {
      if (message.chat.id !== this.$chat.selectedChat?.id) return;
      const findMessage = this.$chat.selectedChat.messages.findIndex(
        (m) => m.content === message.message.content && m.pending
      );
      if (findMessage !== -1) {
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
    });
    this.$socket.on(
      "embedResolution",
      (data: { chatId: number; id: number; embeds: any[] }) => {
        const index = this.$chat.chats.findIndex(
          (c: any) => c.id === data.chatId
        );
        if (index === -1) return;
        if (!this.$chat.chats[index].messages) return;
        const messageIndex = this.$chat.chats[index].messages.findIndex(
          (m: any) => m.id === data.id
        );
        if (messageIndex === -1) return;
        this.$chat.chats[index].messages[messageIndex].embeds = data.embeds;
        this.autoScroll();
      }
    );
    this.$socket.on("readReceipt", (data: any) => {
      const index = this.$chat.chats.findIndex(
        (c: any) => c.id === data.chatId
      );
      if (index === -1) return;
      if (!this.$chat.chats[index].messages) return;
      const messageIndex = this.$chat.chats[index].messages.findIndex(
        (m: any) => m.id === data.id
      );
      if (messageIndex === -1) return;
      this.$chat.chats[index].messages.forEach((message: any) => {
        message.readReceipts = message.readReceipts.filter(
          (r: any) => r.user.id !== data.user.id
        );
      });
      this.$chat.selectedChat?.messages[messageIndex].readReceipts.push(data);
    });
    this.$socket.on("typing", (data: Typing) => {
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
    });
  },
  unmounted() {
    document.removeEventListener("scroll", this.scrollEvent);
    document.removeEventListener("keydown", this.shortcutHandler);
    document
      .querySelector(".message-list-container")
      ?.removeEventListener("scroll", this.scrollEvent);
  },
  watch: {
    "$chat.isReady"() {
      this.avoidAutoScroll = false;
      this.$nextTick(() => {
        this.autoScroll();
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

<style scoped>
.message-list-container {
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
}

.message-list-container::-webkit-scrollbar {
  display: none;
}

.message-input {
  position: sticky;
  padding: 16px;
}
</style>
