import { ref, computed, markRaw, type Raw, type ComputedRef } from "vue";
import { defineStore } from "pinia";
import type { BlockedUser, PartialUserFriend, User } from "@/gql/graphql";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const tracked = ref<PartialUserFriend[]>([]);
  const blocked = ref<BlockedUser[]>([]);

  const gold = computed(() => {
    return user?.value?.plan?.internalName === "GOLD";
  });

  const users: ComputedRef<Record<number, PartialUserFriend>> = computed(() => {
    return tracked.value.reduce((acc, item) => {
      if (item.id === user.value.id) {
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

  return {
    user,
    gold,
    blocked,
    tracked,
    users,
    unreadNotifications
  };
});
