// Utilities
import { defineStore } from "pinia";
import { User } from "@/models/user";
import axios from "@/plugins/axios";

export interface UserState {
  user: User | null;
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
        } catch {
          //
        }
      }
      const { data } = await axios.get("/user");
      this.user = data;
      localStorage.setItem("userStore", JSON.stringify(data));
    }
  }
});
