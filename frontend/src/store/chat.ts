// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { Chat } from "@/models/chat";
import { useExperimentsStore } from "@/store/experiments";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/app";
import { computed } from "vue";
import { User } from "@/models/user";

export interface ChatState {
  notifications: number;
  chats: Chat[];
  selectedChatId: number | null;
  loading: boolean;
  drafts: { [key: number]: string };
  selectedChat: Chat | null;
  memberSidebarShown: boolean;
  isReady: number | null;
  users: User[];
  dialogs: {
    user: {
      value: boolean;
      username: string;
    };
  };
}

export const useChatStore = defineStore("chat", {
  state: () =>
    ({
      notifications: 0,
      chats: [] as Chat[],
      loading: false,
      drafts: {},
      selectedChatId: null,
      memberSidebarShown: true,
      isReady: null,
      dialogs: {
        user: {
          value: false,
          username: ""
        }
      }
    } as ChatState),
  actions: {
    async createChat(users: number[]) {
      const { data } = await axios.post("/chats", { users });
      return data;
    },
    async readChat() {
      await axios.put(`/chats/${this.selectedChatId}/read`);
    },
    async setChat(id: number) {
      this.selectedChatId = id;
      const appStore = useAppStore();
      const chat = this.chats.find(
        (chat: Chat) => chat.association.id === id
      ) as Chat;
      if (chat.messages?.length) {
        appStore.title = this.chatName;
        this.loading = false;
        this.isReady = id;
        this.readChat();
        return;
      } else {
        this.loading = true;
      }
      const { data } = await axios.get(`/chats/${id}/messages`);
      const index = this.chats.findIndex(
        (chat: Chat) => chat.association.id === id
      );
      this.chats[index] = {
        ...(this.chats.find(
          (chat: Chat) => chat.association.id === id
        ) as Chat),
        messages: data,
        unread: 0
      };
      this.loading = false;
      this.isReady = id;
      appStore.title = this.chatName;

      this.readChat();
    },
    async getChats() {
      try {
        const chats = localStorage.getItem("chatStore");
        if (chats) {
          this.chats = JSON.parse(chats);
        }
      } catch {}
      const { data } = await axios.get("/chats");
      this.chats = data;
      localStorage.setItem("chatStore", JSON.stringify(this.chats));
    },
    async init() {
      this.getChats();
    }
  },
  getters: {
    totalUnread(state: ChatState) {
      return state.chats.reduce((total: number, chat: Chat) => {
        return total + chat.unread;
      }, 0);
    },
    selectedChat(state: ChatState) {
      return state.chats.find(
        (chat: Chat) => chat.association.id === state.selectedChatId
      ) as Chat | null;
    },
    chatName(state: ChatState) {
      if (!state.selectedChat) return "Communications";
      if (state.selectedChat.type === "direct") {
        return state.selectedChat.recipient?.username || "Deleted User";
      } else {
        return state.selectedChat.name;
      }
    },
    communicationsSidebar() {
      const experimentsStore = useExperimentsStore();
      if (experimentsStore.experiments["COMMUNICATIONS_QUAD_SIDEBAR_LOWRES"])
        return true;
      if (
        experimentsStore.experiments["COMMUNICATIONS_INLINE_SIDEBAR_HIRES"] &&
        vuetify.display.lgAndUp.value
      )
        return false;
      return !vuetify.display.lgAndDown.value;
    },
    memberSidebar(state: ChatState) {
      if (!state.memberSidebarShown) return false;
      const experimentsStore = useExperimentsStore();
      if (experimentsStore.experiments["COMMUNICATIONS_QUAD_SIDEBAR_LOWRES"])
        return true;
      if (
        experimentsStore.experiments["COMMUNICATIONS_INLINE_SIDEBAR_HIRES"] &&
        vuetify.display.lgAndUp.value
      )
        return false;
      return !vuetify.display.lgAndDown.value;
    },
    isCommunications() {
      const router = useRouter();
      return router.currentRoute.value.path.startsWith("/communications/");
    }
  }
});
