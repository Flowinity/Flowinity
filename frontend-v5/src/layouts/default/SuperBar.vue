<template>
  <aside
    class="border-r-2 superbar sticky z-50 dark:border-outline-dark dark:bg-sidebar-dark p-3 border-dark space-x-1 flex flex-col overflow-y-auto overflow-x-hidden"
    style="scrollbar-width: none; min-width: 72px; max-width: 72px; width: 72px"
    :class="{ 'h-screen': !props.drawer, 'h-[calc(100vh-64px)]': props.drawer }"
  >
    <div class="justify-between flex flex-col h-full">
      <div class="items-start">
        <div class="flex flex-col gap-y-4">
          <img
            src="@/assets/flowinity.svg"
            alt="Flowinity Logo"
            @click="
              $router.push('/');
              appStore.navigation.mode = RailMode.HOME;
            "
            class="cursor-pointer"
            draggable="false"
            v-tooltip.right="'Flowinity'"
            style="width: 46.55px; height: 46.55px"
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
              (opt) => !opt.misc && !opt.fake
            )"
            :key="item.id"
            :selected="appStore.navigation.mode === item.id"
            @click="appStore.navigation.mode = item.id"
            class="text-gray"
            :badge="item.badge"
            draggable="true"
            @dragstart="handleDragStart"
            @dragend="handleDragEnd"
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
        <template v-if="experimentsStore.experiments.COMMS_SUPERBAR">
          <div
            class="divide-outline-dark border border-outline-dark mt-4 w-full"
          />
          <div class="flex flex-col gap-y-2 mt-4">
            <super-bar-item
              v-for="item in chatStore.chats"
              :key="item.id"
              :selected="route.params.chatId === item.association.id"
              @click="appStore.navigation.mode = item.id"
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
                :user-id="userStore.user?.id"
                :username="userStore.user?.username"
                :status="true"
              />
            </super-bar-item>
            <template #popper="{ hide }">
              <UserStatusPicker @click="hide()" />
            </template>
          </VDropdown>
        </div>
        {{ isDragging }} {{ isHovering }}
      </div>
    </div>
    <teleport to="#main-area" v-if="isDragging">
      <div class="absolute top-0 left-0 z-50 w-full">
        <div class="flex gap-4 justify-center pt-4 w-full">
          <tpu-button
            icon
            color="red"
            @dragover.prevent
            @dragenter="handleDragEnter($event, 'close')"
            @drop="handleDrop($event, 'close')"
            :variant="isHovering !== 'close' ? 'tonal' : 'filled'"
          >
            <ri-close-line style="width: 40px" />
          </tpu-button>
          <tpu-button icon>
            <ri-arrow-right-s-line style="width: 40px" />
          </tpu-button>
        </div>
      </div>
    </teleport>
  </aside>
</template>

<script setup lang="ts">
import { RailMode, useAppStore } from "@/stores/app.store";
import SuperBarItem from "@/components/Framework/Navigation/SuperBarItem.vue";
import RiSearchLine from "vue-remix-icons/icons/ri-search-line.vue";
import RiSettings5Line from "vue-remix-icons/icons/ri-settings-5-line.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { useUserStore } from "@/stores/user.store";
import RiNotificationLine from "vue-remix-icons/icons/ri-notification-line.vue";
import RiNotificationFill from "vue-remix-icons/icons/ri-notification-fill.vue";
import UserStatusPicker from "@/components/User/UserStatusPicker.vue";
import { useChatStore } from "@/stores/chat.store";
import { useRoute } from "vue-router";
import functions from "@/plugins/functions";
import { useExperimentsStore } from "@/stores/experiments.store";
import { ref } from "vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import RiArrowRightSLine from "vue-remix-icons/icons/ri-arrow-right-s-line.vue";

const appStore = useAppStore();
const props = defineProps({
  drawer: Boolean
});
const userStore = useUserStore();
const chatStore = useChatStore();
const experimentsStore = useExperimentsStore();
const route = useRoute();
const isDragging = ref(false);
const isHovering = ref<"close" | "move" | null>(null);

const handleDragStart = (e: DragEvent) => {
  isDragging.value = true;
};

const handleDragEnd = (e: DragEvent) => {
  isDragging.value = false;
};

const handleDragEnter = (e: DragEvent, type: "close" | "move") => {
  e.preventDefault();
  e.stopPropagation();
  isHovering.value = type;
};

const handleDragLeave = (e: DragEvent, type: "close" | "move") => {
  e.preventDefault();
  e.stopPropagation();
  isHovering.value = null;
};

const handleDrop = (e: DragEvent, type: "close" | "move") => {
  e.preventDefault();
  e.stopPropagation();
  if (type === "close") {
    appStore.navigation.mode = RailMode.HOME;
  }
  isHovering.value = null;
  isDragging.value = false;
};
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
