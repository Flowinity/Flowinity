// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { Workspace } from "@/models/workspace";
import { Note } from "@/models/note";
import { User } from "@/models/user";
import { Chat } from "@/models/chat";

export interface ChatState {
  notifications: number;
  chats: Chat[];
  selectedChat: Chat | null;
  loading: boolean;
}

export const useChatStore = defineStore("chat", {
  state: () =>
    ({
      notifications: 0,
      chats: [] as Chat[],
      selectedChat: null as Chat | null,
      loading: false
    } as ChatState),
  actions: {
    async setChat(id: number) {
      this.loading = true;
      const { data } = await axios.get(`/chats/${id}/messages`);
      this.selectedChat = {
        ...(this.chats.find(
          (chat: Chat) => chat.association.id === id
        ) as Chat),
        messages: data
      };
      this.loading = false;
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
  }
});
