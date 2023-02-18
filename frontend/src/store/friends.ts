// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { Friend } from "@/models/friend";

export interface FriendsState {
  friends: Friend[];
}

export const useFriendsStore = defineStore("friends", {
  state: () =>
    ({
      friends: []
    } as FriendsState),
  actions: {
    async getFriends() {
      const friends = localStorage.getItem("friendsStore");
      if (friends) {
        try {
          this.friends = JSON.parse(friends);
        } catch {}
      }
      const { data } = await axios.get("/user/friends");
      this.friends = data;
      localStorage.setItem("friendsStore", JSON.stringify(this.friends));
    },
    async actFriend(userId: number) {
      await axios.post(`/user/friends/${userId}`);
      await this.getFriends();
      return true;
    },
    async init() {
      this.getFriends();
    }
  }
});
