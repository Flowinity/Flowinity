// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { Friend, User } from "@/gql/graphql";

export interface FriendsState {
  friends: Friend[];
}

export const useFriendsStore = defineStore("friends", {
  state: () =>
    ({
      friends: []
    } as FriendsState),
  actions: {
    getName(user: User | number, force = false) {
      if (!user) return undefined;
      const id = typeof user === "number" ? user : user?.id;
      const friend = this.friends.find((f) => f.user.id === id);
      if (friend) {
        return !force
          ? friend.user.nickname?.nickname || friend.user.username
          : friend.user.nickname?.nickname;
      }
      if (typeof user === "number") {
        return undefined;
      }
      return user.username;
    },
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
