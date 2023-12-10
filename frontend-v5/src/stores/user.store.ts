import { ref, computed, type ComputedRef } from "vue";
import { defineStore } from "pinia";
import type {
  BlockedUser,
  PartialUserFriend,
  UpdateUserInput,
  User
} from "@/gql/graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { UpdateUserMutation } from "@/graphql/user/update.graphql";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const tracked = ref<PartialUserFriend[]>([]);
  const blocked = ref<BlockedUser[]>([]);

  const gold = computed(() => {
    return user?.value?.plan?.internalName === "GOLD";
  });

  const users: ComputedRef<Record<number, PartialUserFriend>> = computed(() => {
    return tracked.value.reduce((acc, item) => {
      if (user.value && item.id === user.value.id) {
        const u = user.value;
        acc[item.id] = {
          username: u.username,
          status: u.storedStatus,
          avatar: u.avatar,
          moderator: u.moderator,
          administrator: u.administrator,
          id: u.id,
          createdAt: u.createdAt
        };
        return acc;
      }
      acc[item.id] = item;
      return acc;
    }, {});
  });

  const unreadNotifications = computed(() => {
    return user.value?.notifications.filter((noti) => !noti.dismissed) || [];
  });

  const updatingUser = ref(false);

  async function updateUser() {
    try {
      updatingUser.value = true;
      if (!user.value) return;
      await useApolloClient().client.mutate({
        mutation: UpdateUserMutation,
        variables: {
          input: {
            darkTheme: user.value.darkTheme,
            description: user.value.description,
            discordPrecache: user.value.discordPrecache,
            excludedCollections: user.value.excludedCollections,
            insights: user.value.insights,
            itemsPerPage: user.value.itemsPerPage,
            language: user.value.language,
            nameColor: user.value.nameColor,
            privacyPolicyAccepted: user.value.privacyPolicyAccepted,
            profileLayout: user.value.profileLayout,
            publicProfile: user.value.publicProfile,
            storedStatus: user.value.storedStatus,
            username: user.value.username,
            weatherUnit: user.value.weatherUnit,
            themeEngine: user.value.themeEngine?.theme?.amoled?.colors
              ? user.value.themeEngine
              : null,
            pulse: user.value.pulse,
            groupPrivacy: user.value.groupPrivacy,
            friendRequests: user.value.friendRequests
          }
        } as UpdateUserInput
      });
    } finally {
      updatingUser.value = false;
    }
  }

  return {
    user,
    gold,
    blocked,
    tracked,
    users,
    unreadNotifications,
    updatingUser,
    updateUser
  };
});
