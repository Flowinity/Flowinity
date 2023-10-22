<script setup lang="ts">
import { useAppStore } from "@/stores/app.store";
import SuperBarItem from "@/components/Framework/Navigation/SuperBarItem.vue";
import RiSearchLine from "vue-remix-icons/icons/ri-search-line.vue";
import RiSettings5Line from "vue-remix-icons/icons/ri-settings-5-line.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { useUserStore } from "@/stores/user.store";
import RiNotificationLine from "vue-remix-icons/icons/ri-notification-line.vue";
import RiNotificationFill from "vue-remix-icons/icons/ri-notification-fill.vue";

const appStore = useAppStore();
const props = defineProps({
  drawer: Boolean
});
const userStore = useUserStore();
</script>

<template>
  <aside
    class="border-r-2 sticky z-50 dark:border-outline-dark dark:bg-sidebar-dark p-3 border-dark space-x-1 flex flex-col overflow-y-auto overflow-x-hidden"
    style="min-width: 72px; max-width: 72px"
    :class="{ 'h-screen': !props.drawer, 'h-[calc(100vh-64px)]': props.drawer }"
  >
    <div class="justify-between flex flex-col h-full">
      <div class="items-start">
        <div class="flex flex-col gap-y-4">
          <img
            src="@/assets/flowinity.svg"
            alt="Flowinity Logo"
            @click="$router.push('/')"
            class="cursor-pointer"
            draggable="false"
            v-tooltip.right="'Flowinity'"
          />
          <super-bar-item
            :highlighted="true"
            @click="$app.dialogs.core.quickSwitcher.value = true"
          >
            <RiSearchLine />
          </super-bar-item>
          <super-bar-item
            :highlighted="true"
            @click="$app.dialogs.core.quickSwitcher.value = true"
          >
            <RiNotificationLine v-if="!userStore.unreadNotifications.length" />
            <RiNotificationFill v-else />
          </super-bar-item>
        </div>
        <div
          class="divide-outline-dark border border-outline-dark mt-4 w-full"
        />
        <div class="flex flex-col gap-y-2 mt-4">
          <super-bar-item
            v-for="item in appStore.navigation.railOptions.filter(
              (opt) => !opt.misc
            )"
            :key="item.id"
            :selected="appStore.navigation.mode === item.id"
            @click="appStore.navigation.mode = item.id"
            class="text-gray"
            :badge="item.badge"
          >
            <component
              :is="
                appStore.navigation.mode === item.id
                  ? item.selectedIcon
                  : item.icon
              "
            />
          </super-bar-item>
        </div>
      </div>
      <div class="items-center"></div>
      <div class="items-end">
        <div class="flex flex-col gap-y-2">
          <super-bar-item
            v-for="item in appStore.navigation.railOptions.filter(
              (opt) => opt.misc
            )"
            :key="item.id"
            :selected="appStore.navigation.mode === item.id"
            @click="appStore.navigation.mode = item.id"
            class="text-gray"
            highlighted
          >
            <component
              :is="
                appStore.navigation.mode === item.id
                  ? item.selectedIcon
                  : item.icon
              "
            />
          </super-bar-item>
          <super-bar-item
            class="flex justify-center align-middle items-center rounded-xl"
            style="height: 47px"
          >
            <user-avatar
              :user-id="userStore.user?.id"
              :username="userStore.user?.username"
              :status="true"
            />
          </super-bar-item>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped></style>
