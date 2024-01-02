// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import {
  type Friend,
  FriendStatus,
  Maybe,
  type PartialUserBase,
  type PartialUserFriend,
  type User
} from "@/gql/graphql";
import { useUserStore } from "@/stores/user.store";
import { computed, ref } from "vue";
import { useApolloClient, useMutation } from "@vue/apollo-composable";
import { FriendsQuery } from "@/graphql/user/friends.graphql";

export const useFriendsStore = defineStore("friends", () => {
  const friends = ref<Friend[]>([]);
  const apollo = useApolloClient();
  const userStore = useUserStore();

  const validFriends = computed(() => {
    return friends.value.filter(
      (friend) => friend.status === FriendStatus.Accepted
    );
  });

  function friendStatus(userId: number) {
    return (
      userStore.tracked.find((user) => user.id === userId)?.status ||
      friends.value.find((friend) => friend.friendId === userId)?.status ||
      FriendStatus.None
    );
  }

  function getName(
    user:
      | PartialUserFriend
      | PartialUserBase
      | User
      | number
      | undefined
      | Maybe<number>,
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
  }

  async function getFriends() {
    const {
      data: { friends }
    } = await apollo.client.query({
      query: FriendsQuery,
      fetchPolicy: "network-only"
    });
    return friends;
  }

  async function actFriend(userId: number) {
    /*const data = useMutation(ActFriendMutation, {
      variables: {
        input: {
          userId
        }
      }
    });
    return await data.mutate();*/
  }

  async function init() {
    friends.value = await getFriends();
  }

  return {
    friends,
    getFriends,
    actFriend,
    init,
    validFriends,
    friendStatus,
    getName
  };
});
