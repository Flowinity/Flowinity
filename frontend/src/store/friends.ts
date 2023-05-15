// Utilities
import {defineStore} from "pinia"
import axios from "@/plugins/axios"
import {Friend} from "@/models/friend"
import {User} from "@/models/user"

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
      if (!user) return undefined
      const id = typeof user === "number" ? user : user?.id
      const friend = this.friends.find((f) => f.otherUser.id === id)
      if (friend) {
        return !force
          ? friend.otherUser.nickname?.nickname || friend.otherUser.username
          : friend.otherUser.nickname?.nickname
      }
      if (typeof user === "number") {
        return undefined
      }
      return user.username
    },
    async getFriends() {
      const friends = localStorage.getItem("friendsStore")
      if (friends) {
        try {
          this.friends = JSON.parse(friends)
        } catch {
        }
      }
      const {data} = await axios.get("/user/friends")
      this.friends = data
      localStorage.setItem("friendsStore", JSON.stringify(this.friends))
    },
    async actFriend(userId: number) {
      await axios.post(`/user/friends/${userId}`)
      await this.getFriends()
      return true
    },
    async init() {
      this.getFriends()
    }
  }
})
