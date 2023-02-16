// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { Workspace } from "@/models/workspace";
import { Note } from "@/models/note";

export interface ChatState {
  notifications: number;
  chats: Chat[];
  selectedChat: Chat | null;
}

export interface Chat {
  id: number;
}

export const useChatStore = defineStore("chat", {
  state: () =>
    ({
      notifications: 0,
      chats: [] as Chat[],
      selectedChat: null as Chat | null
    } as ChatState),
  actions: {
    async getChats() {
      //const { data } = await axios.get("/chats");
      ///this.chats = data;
    },
    async init() {
      this.getChats();
    }
  }
});
