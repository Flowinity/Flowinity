// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import {
  Friend,
  FriendStatus,
  PartialUserBase,
  PartialUserFriend,
  User
} from "@/gql/graphql";
import { useUserStore } from "@/store/user.store";

export interface FriendsState {
  friends: Friend[];
}

export const useFriendsStore = defineStore("friends", {
  state: () =>
    ({
      friends: []
    } as FriendsState),
  actions: {
    friendStatus(userId: number) {
      return (
        this.friends.find((friend) => friend.friendId === userId)?.status ||
        FriendStatus.None
      );
    },
    getName(
      user: PartialUserFriend | PartialUserBase | User | number,
      force = false
    ) {
      if (!user) return undefined;
      const userStore = useUserStore();
      const id = typeof user === "number" ? user : user?.id;
      const friend = userStore.users[id];
      if (friend) {
        return !force
          ? friend.nickname?.nickname || friend.username
          : friend.nickname?.nickname;
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
