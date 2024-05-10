<template>
  <v-navigation-drawer
    v-model="$app.mainDrawer"
    rail
    class="border-r-2 superbar sticky z-50 dark:border-outline-dark p-3 border-dark space-x-1 flex flex-col overflow-y-auto overflow-x-hidden"
    style="scrollbar-width: none; min-width: 72px; max-width: 72px; width: 72px"
    :class="{ 'sidebar-patch': !$vuetify.display.mobile }"
  >
    <div class="justify-between flex flex-col h-full">
      <div class="items-start">
        <div class="flex flex-col gap-y-4">
          <FlowinityLogo
            src="@/"
            alt="Flowinity Logo"
            @click="
              $router.push('/');
              uiStore.navigation.mode = RailMode.HOME;
            "
            class="cursor-pointer"
            draggable="false"
            v-tooltip.right="'Flowinity'"
            style="width: 46.55px; height: 46.55px"
          />
          <super-bar-item
            :highlighted="true"
            @click="$app.dialogs.quickSwitcher = true"
          >
            <RiSearchLine />
          </super-bar-item>
          <super-bar-item
            :highlighted="true"
            @click="$app.dialogs.quickSwitcher = true"
          >
            <RiNotificationLine v-if="!userStore.unreadNotifications" />
            <RiNotificationFill v-else />
          </super-bar-item>
        </div>
        <div
          class="divide-outline-dark border border-outline-dark mt-4 w-full"
        />
        <div class="flex flex-col gap-y-2 mt-4">
          <super-bar-item
            v-for="item in uiStore.navigation.railOptions.filter(
              (opt) => !opt.misc && !opt.fake
            )"
            :key="item.id"
            :selected="uiStore.navigation.mode === item.id"
            @click="uiStore.navigation.mode = item.id"
            :badge="item.badge"
          >
            <component
              :is="
                uiStore.navigation.mode === item.id
                  ? item.selectedIcon
                  : item.icon
              "
            />
          </super-bar-item>
        </div>
        <template v-if="experimentsStore.experiments.COMMS_SUPERBAR">
          <div
            class="divide-outline-dark border border-outline-dark mt-4 w-full"
          />
          <div class="flex flex-col gap-y-2 mt-4">
            <super-bar-item
              v-for="item in chatStore.chats"
              :key="item.id"
              :selected="route.params.chatId === item.association.id"
              @click="uiStore.navigation.mode = item.id"
              class="flex justify-center align-middle items-center rounded-xl"
              :badge="item?.unread"
              style="height: 47px"
            >
              <user-avatar :src="functions.avatar(item)" />
            </super-bar-item>
          </div>
        </template>
      </div>
      <div class="items-center"></div>
      <div class="items-end">
        <div class="flex flex-col gap-y-2">
          <super-bar-item
            v-for="item in uiStore.navigation.railOptions.filter(
              (opt) => opt.misc
            )"
            :key="item.id"
            :selected="uiStore.navigation.mode === item.id"
            @click="uiStore.navigation.mode = item.id"
            highlighted
          >
            <component
              :is="
                uiStore.navigation.mode === item.id
                  ? item.selectedIcon
                  : item.icon
              "
            />
          </super-bar-item>
          <VDropdown
            :triggers="['click']"
            placement="right"
            class="flex items-center justify-center"
          >
            <super-bar-item
              class="flex justify-center align-middle items-center rounded-xl"
              style="height: 47px"
            >
              <user-avatar
                :user="$user.user"
                :status="true"
                :dot-status="true"
              />
            </super-bar-item>
            <template #popper="{ hide }">
              <UserStatusPicker @click="hide()" />
            </template>
          </VDropdown>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app.store";
import { useProgressiveUIStore, RailMode } from "@/store/progressive.store";
import { useUserStore } from "@/store/user.store";
import { useChatStore } from "@/store/chat.store";
import { useRoute } from "vue-router";
import functions from "@/plugins/functions";
import { useExperimentsStore } from "@/store/experiments.store";
import { ref } from "vue";
import SuperBarItem from "@/layouts/progressive/SuperBarItem.vue";
import {
  RiNotificationFill,
  RiNotificationLine,
  RiSearchLine
} from "@remixicon/vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import FlowinityLogo from "@/components/Brand/FlowinityLogo.vue";

const appStore = useAppStore();
const uiStore = useProgressiveUIStore();
const props = defineProps({
  drawer: Boolean
});
const userStore = useUserStore();
const chatStore = useChatStore();
const experimentsStore = useExperimentsStore();
const route = useRoute();
</script>
<style scoped>
.superbar {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}
.superbar::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>
