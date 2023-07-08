import {defineStore} from "pinia";

// Import Plugins
import axios from "@/plugins/axios";

// Import Models
import {Friend} from "@/models/friend";
import {User} from "@/models/user";

export interface FriendsState {
  friends: Friend[];
}

export const useFriendsStore = defineStore("friends", {
  state: () =>
    ({
      friends: []
    } as FriendsState),
  actions: {
    getName(user: User | number, force: boolean = false): undefined | string {
      if (!user) return undefined;

      const id: number = typeof user === "number" ? user : user?.id;
      const friend = this.friends.find((f): boolean => f.otherUser.id === id);

      if (friend) return !force
        ? friend.otherUser.nickname?.nickname || friend.otherUser.username
        : friend.otherUser.nickname?.nickname;
      if (typeof user === "number") return undefined;

      return user.username;
    },
    async getFriends(): Promise<void> {
      const friends: string = localStorage.getItem("friendsStore");

      if (friends) try {
        this.friends = JSON.parse(friends);
      } catch {
      }

      const {data} = await axios.get("/user/friends");

      this.friends = data;

      localStorage.setItem("friendsStore", JSON.stringify(this.friends));
    },
    async actFriend(userId: number): Promise<boolean> {
      await axios.post(`/user/friends/${userId}`);
      await this.getFriends();

      return true;
    },
    async init(): Promise<void> {
      await this.getFriends();
    }
  }
});
