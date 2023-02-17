<template>
  <div id="chat">
    <v-list
      color="transparent"
      bg-color="transparent"
      style="padding-bottom: 110px"
      id="chat-list"
      @scroll="scrollEvent"
    >
      <Message
        v-for="(message, index) in $chat.selectedChat?.messages"
        :key="message.id"
        :message="message"
        :id="'message-' + index"
        :editing="editing === message.id"
      ></Message>
    </v-list>
    <v-fade-transition v-model="avoidAutoScroll">
      <v-toolbar
        :style="inputStyles + ` bottom: ${inputHeight}px`"
        height="10"
        style="border-radius: 20px 20px 0 0; opacity: 0.95"
        @click="forceBottomAmirite"
        class="pointer"
        v-if="avoidAutoScroll"
      >
        <v-icon class="mr-2">mdi-arrow-down</v-icon> Force bottom
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
export default defineComponent({
  name: "Chat",
  components: { Message, CommunicationsInput },
  data() {
    return {
      message: "",
      avoidAutoScroll: false,
      editing: null as number | null
    };
  },
  computed: {
    inputHeight() {
      // count how many \n's there are
      const lines = this.message.split("\n").length;
      return (lines - 1) * 24 + 82;
    },
    inputStyles() {
      let widthOffset = 0;
      if (this.$vuetify.display.mobile) {
        widthOffset = 0;
      }
      if (!this.$vuetify.display.mobile) {
        if (this.$app.workspaceDrawer) {
          widthOffset += 256;
        }
        if (this.$app.mainDrawer) {
          widthOffset += 256;
        }
        widthOffset += 256;
      }
      return `position: fixed; width: calc(100% - ${widthOffset}px); padding: 16px;`;
    }
  },
  methods: {
    forceBottomAmirite() {
      this.avoidAutoScroll = false;
      this.autoScroll();
    },
    async sendMessage() {
      if (!this.message) return;
      const message = this.message;
      this.message = "";
      const tempId = new Date().getTime();
      const index = await this.$chat.selectedChat?.messages.push({
        content: message,
        createdAt: new Date().toISOString(),
        user: this.$user.user,
        pending: true,
        id: tempId,
        chatId: 0,
        updatedAt: new Date().toISOString(),
        type: "message",
        embeds: [],
        edited: false
      });
      this.autoScroll();
      try {
        const { data } = await this.axios.post(
          `/chats/${this.$route.params.chatId}/message`,
          {
            content: message
          }
        );
        if (!index) return;
        this.$chat.selectedChat?.messages.splice(index - 1, 1, data);
      } catch (e) {
        if (!index) return;
        this.$chat.selectedChat?.messages.splice(index - 1, 1, {
          ...this.$chat.selectedChat?.messages[index - 1],
          pending: false,
          error: true
        });
      }
    },
    autoScroll() {
      if (this.avoidAutoScroll) return;
      if (!this.$chat.selectedChat) return;
      const message = document.getElementById(
        `message-${this.$chat.selectedChat.messages.length - 1}`
      );

      if (message) {
        message.scrollIntoView();
      }
    },
    scrollEvent(e: any) {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

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
      this.editing = lastMessage.id;
    },
    shortcutHandler(e: any) {
      if (e.key === "ArrowUp" && !this.message.length) {
        this.editLastMessage();
      }
      if (
        e.target.tagName === "INPUT" &&
        e.target.tagName === "TEXTAREA" &&
        e.target.tagName === "DIV"
      )
        return;
      if (e.key === "Escape") {
        this.forceBottomAmirite();
      }
      if (
        e.target.tagName !== "INPUT" &&
        e.target.tagName !== "TEXTAREA" &&
        e.target.tagName !== "DIV"
      ) {
        //@ts-ignore
        this.$refs.input?.$refs?.textarea?.focus();
      }
    }
  },
  mounted() {
    // add event listener for scroll
    document.addEventListener("scroll", this.scrollEvent);
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
      await this.$chat.selectedChat?.messages.push(
        message.message as MessageType
      );
      this.autoScroll();
    });
  },
  unmounted() {
    document.removeEventListener("scroll", this.scrollEvent);
  },
  watch: {
    "$chat.selectedChat.id"() {
      this.avoidAutoScroll = false;
      this.$nextTick(() => {
        this.autoScroll();
      });
    }
  }
});
</script>
