<template>
  <div id="chat">
    <v-list
      color="transparent"
      bg-color="transparent"
      style="padding-bottom: 110px"
      id="chat-list"
      class="message-list-container"
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
          $chat.dialogs.userMenu.value = true;
        "
        @reply="replyId = $event.id"
      ></Message>
      <MessageSkeleton v-for="i in 30" v-if="$chat.loading"></MessageSkeleton>
    </v-list>
    <v-fade-transition v-model="avoidAutoScroll">
      <v-toolbar
        :style="inputStyles + ` bottom: ${inputHeight + replyingHeight}px`"
        height="10"
        style="border-radius: 20px 20px 0 0; opacity: 0.95"
        @click="forceBottomAmirite"
        class="pointer"
        v-if="avoidAutoScroll"
      >
        <v-icon class="mr-2">mdi-arrow-down</v-icon>
        Jump to bottom
      </v-toolbar>
    </v-fade-transition>
    <v-fade-transition v-model="replyId">
      <v-toolbar
        :style="
          inputStyles +
          ` bottom: ${inputHeight}px` +
          (!avoidAutoScroll ? '; border-radius: 20px 20px 0 0;' : '')
        "
        height="10"
        style="opacity: 0.95"
        @click="forceBottomAmirite"
        class="pointer"
        v-if="replyId"
      >
        <v-icon class="mr-2">mdi-reply</v-icon>
        <UserAvatar size="24" :user="replying.user" class="mr-2"></UserAvatar>
        {{ replying.content }}
      </v-toolbar>
    </v-fade-transition>
    <CommunicationsInput
      v-model="message"
      :style="inputStyles"
      @sendMessage="sendMessage"
      style="bottom: 0"
      ref="input"
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
export default defineComponent({
  name: "Chat",
  components: {
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
      observer: undefined as MutationObserver | undefined
    };
  },
  computed: {
    replyingHeight() {
      if (this.replyId) return 41.5;
      return 0;
    },
    replying() {
      return this.$chat.selectedChat?.messages.find(
        (message) => message.id === this.replyId
      );
    },
    inputHeight() {
      const lines = this.message.split("\n").length;
      return (lines - 1) * 24 + 78;
    },
    inputStyles() {
      const drawers = document.querySelectorAll(
        ".v-navigation-drawer--active:not(.v-navigation-drawer--temporary)"
      );
      let bind;
      bind = [
        this.$vuetify.display.mobile,
        this.$app.workspaceDrawer,
        this.$chat.communicationsSidebar,
        this.$chat.memberSidebar,
        this.$chat.isReady
      ];
      return `position: fixed; width: calc(100% - ${
        256 * drawers.length
      }px); padding: 16px;`;
    }
  },
  methods: {
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
      if (!this.message) return;
      const message = this.message;
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
        replyId: this.replyId
      });
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
        const { data } = await this.axios.post(
          `/chats/${this.$route.params.chatId}/message`,
          {
            content: message,
            replyId: this.replyId
          }
        );
        const messageIndex = this.$chat.selectedChat?.messages.findIndex(
          (message) => message.id === tempId
        );
        console.log(messageIndex);
        if (
          messageIndex === -1 ||
          messageIndex === undefined ||
          !this.$chat.selectedChat
        )
          return;
        this.$chat.selectedChat.messages[messageIndex] = data;
      } catch (e) {
        console.log(e);
        const messageIndex = this.$chat.selectedChat?.messages.findIndex(
          (message) => message.id === tempId
        );
        console.log(messageIndex);
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
      return;
      if (this.avoidAutoScroll) return;
      if (!this.$chat.selectedChat?.messages) return;
      const message = document.getElementById(
        `message-${this.$chat.selectedChat.messages?.length - 1}`
      );
      if (message) {
        message.scrollIntoView();
      }
    },
    scrollEvent(e: any) {
      const scrollHeight = e.target.scrollHeight;
      const scrollTop = e.target.scrollTop;
      const clientHeight = e.target.clientHeight;
      this.avoidAutoScroll =
        scrollTop + clientHeight <= scrollHeight - clientHeight / 8;
    },
    editLastMessage() {
      // find last message made by user
      const lastMessage = this.$chat.selectedChat?.messages
        .slice()
        .reverse()
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
    this.$socket.on("message", async (message: MessageSocket) => {
      if (message.chat.id !== this.$chat.selectedChat?.id) return;
      if (
        this.$chat.selectedChat.messages.find(
          (m) => m.id === message.message.id
        )
      )
        return;
      await this.$chat.chats
        .find((c) => c.id === this.$chat.selectedChat?.id)
        ?.messages.unshift(message.message);
      this.$chat.readChat();
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
  },
  unmounted() {
    document.removeEventListener("scroll", this.scrollEvent);
    document.removeEventListener("keydown", this.shortcutHandler);
  },
  watch: {
    "$chat.isReady"() {
      this.avoidAutoScroll = false;
      this.$nextTick(() => {
        this.autoScroll();
      });
    }
  }
});
</script>

<style scoped>
.message-list-container {
  height: 96vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
}

.message-list-container::-webkit-scrollbar {
  display: none;
}
</style>
