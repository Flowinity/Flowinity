import { ref, computed, markRaw, type Raw } from "vue";
import { defineStore } from "pinia";
import type { BlockedUser, PartialUserFriend, User } from "@/gql/graphql";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const tracked = ref<PartialUserFriend[]>([]);
  const blocked = ref<BlockedUser[]>([]);

  const gold = computed(() => {
    return user?.value?.plan?.internalName === "GOLD";
  });

  return {
    user,
    gold,
    blocked,
    tracked
  };
});
