// Utilities
import { defineStore } from "pinia";
import { User } from "@/models/user";
import axios from "@/plugins/axios";

export interface UserState {
  user: User | null;
  changes: {
    password?: string;
    email?: string;
    discordPrecache?: boolean;
    username?: string;
    itemsPerPage?: number;
    currentPassword?: string;
  };
}

export const useUserStore = defineStore("user", {
  state: () =>
    ({
      user: null
    } as UserState),
  getters: {},
  actions: {
    async init() {
      const user = localStorage.getItem("userStore");
      if (user) {
        try {
          this.user = JSON.parse(user);
          if (this.user) {
            this.changes = {
              password: "",
              email: this.user.email,
              discordPrecache: this.user.discordPrecache,
              username: this.user.username,
              itemsPerPage: this.user.itemsPerPage,
              currentPassword: ""
            };
          }
        } catch {
          //
        }
      }
      const { data } = await axios.get("/user");
      this.user = data;
      localStorage.setItem("userStore", JSON.stringify(data));
    },
    async save() {
      if (!this.user) return;
      await axios.patch("/user", {
        password: this.changes.password,
        currentPassword: this.changes.currentPassword,
        email: this.changes.email,
        discordPrecache: this.changes.discordPrecache,
        username: this.changes.username,
        itemsPerPage: this.changes.itemsPerPage
      });
      this.user = {
        ...this.user,
        ...this.changes
      };
    }
  }
});
