<script setup lang="ts">
import { RailMode, useAppStore } from "@/stores/app.store";
import SideBarItem from "@/components/Core/Navigation/SideBarItem.vue";
import { useChatStore } from "@/stores/chat.store";
import { useCollectionsStore } from "@/stores/collections.store";
import TpuOverline from "@/components/Core/Typography/TpuOverline.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import functions from "@/plugins/functions";
import RiGroupLine from "vue-remix-icons/icons/ri-group-line.vue";
import { useFriendsStore } from "@/stores/friends.store";
import { computed } from "vue";
import { UserStatus, UserStoredStatus } from "@/gql/graphql";
import { useUserStore } from "@/stores/user.store";
import { useI18n } from "vue-i18n";
const appStore = useAppStore();
const chatStore = useChatStore();
const friendStore = useFriendsStore();
const userStore = useUserStore();
const collectionsStore = useCollectionsStore();
const props = defineProps({
  drawer: Boolean
});
const { t } = useI18n();

const ranks = computed(() => {
  if (!chatStore.selectedChat) return [];
  return [
    ...chatStore.selectedChat!.ranks.map((rank) => {
      return {
        ...rank,
        users: chatStore
          .selectedChat!.users.filter((user) => {
            return (
              user.ranksMap[0] === rank.id &&
              (user.userId === userStore.user?.id ||
                (userStore.users[user.userId]?.status !== UserStatus.Offline &&
                  userStore.users[user.id]?.status !==
                    UserStoredStatus.Invisible &&
                  userStore.users[user.userId]?.status))
            );
          })
          .map((user) => {
            return {
              ...user,
              user: userStore.users[user.userId]
            };
          })
      };
    }),
    {
      name: t("chats.roles.online"),
      users: chatStore.selectedChat.users
        .filter((user) => {
          return (
            userStore.users[user.userId]?.status !== UserStatus.Offline &&
            !user.ranksMap.length &&
            !user.legacyUserId
          );
        })
        .map((user) => {
          return {
            ...user,
            user: userStore.users[user.userId]
          };
        })
    },
    {
      name: t("chats.roles.offline"),
      users: chatStore.selectedChat.users
        .filter((user) => {
          return (
            userStore.users[user.userId]?.status === UserStatus.Offline &&
            user.userId !== userStore.user?.id
          );
        })
        .map((user) => {
          return {
            ...user,
            user: userStore.users[user.userId]
          };
        })
    }
  ];
});
</script>

<template>
  <aside
    class="border-l-2 sticky z-50 dark:border-outline-dark dark:bg-sidebar-dark border-dark flex flex-col overflow-y-auto overflow-x-hidden"
    style="min-width: 256px; max-width: 256px"
    :class="{ 'h-screen': !props.drawer, 'h-[calc(100vh-64px)]': props.drawer }"
  >
    <div
      v-if="appStore.currentRail"
      class="flex items-center pt-0 dark:border-outline-dark border-b-2 border-outline-dark"
      style="min-height: 64px; max-height: 64px"
    >
      <RiGroupLine class="w-8 ml-3" />
      <p class="text-xl font-semibold ml-4 select-none">
        {{ $t("communications.members.title") }}
      </p>
    </div>
    <Transition name="slide-fade" mode="out-in">
      <div class="mt-2 p-1">
        <div v-for="group in ranks" :key="group.name">
          <template v-if="group.users.length">
            <tpu-overline
              position="start"
              class="select-none"
              style="padding: 0"
            >
              {{ group.name }} ({{ group.users.length }})
            </tpu-overline>
            <SideBarItem
              v-for="assoc in group.users"
              :key="assoc.id"
              :class="{
                'opacity-[0.4]':
                  userStore.users[assoc?.userId ?? 0]?.status ===
                  UserStatus.Offline
              }"
            >
              <template #icon>
                <user-avatar
                  :status="true"
                  :username="friendStore.getName(assoc.userId || 0)"
                  :user-id="assoc.userId || 0"
                ></user-avatar>
              </template>
              <template #title>
                {{ friendStore.getName(assoc.userId || 0) }}
              </template>
            </SideBarItem>
          </template>
        </div>
      </div>
    </Transition>
  </aside>
</template>

<style>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(0.49, 0.61, 0.83, 0.67);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
