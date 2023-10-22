<script setup lang="ts">
import { RailMode, useAppStore } from "@/stores/app.store";
import SideBarItem from "@/components/Framework/Navigation/SideBarItem.vue";
import { useChatStore } from "@/stores/chat.store";
import { useCollectionsStore } from "@/stores/collections.store";
import TpuOverline from "@/components/Framework/Typography/TpuOverline.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import functions from "@/plugins/functions";

const appStore = useAppStore();
const chatStore = useChatStore();
const collectionsStore = useCollectionsStore();
const props = defineProps({
  drawer: Boolean
});
</script>

<template>
  <aside
    class="border-r-2 sticky z-50 dark:border-outline-dark dark:bg-sidebar-dark border-dark flex flex-col overflow-y-auto overflow-x-hidden"
    style="min-width: 256px; max-width: 256px"
    :class="{ 'h-screen': !props.drawer, 'h-[calc(100vh-64px)]': props.drawer }"
  >
    <div
      v-if="appStore.currentRail"
      class="flex items-center pt-0 dark:border-outline-dark border-b-2 border-outline-dark"
      style="min-height: 64px; max-height: 64px"
    >
      <component :is="appStore.currentRail?.icon" class="w-8 ml-4" />
      <p class="text-xl font-semibold ml-4">
        {{ appStore.currentRail.name }}
      </p>
    </div>
    <Transition name="slide-fade" mode="out-in">
      <div
        class="justify-between flex-col flex-1 px-3"
        :key="appStore.currentRail?.id"
        style="margin-top: 16px"
      >
        <div class="flex-col flex gap-y-2 flex-1">
          <template v-if="appStore.currentRail?.id === RailMode.CHAT">
            <div v-for="chat in chatStore.chats" :key="chat.id">
              <SideBarItem :to="`/communications/${chat.association?.id}`">
                <template #icon>
                  <user-avatar
                    :username="chat.type === 'group' ? chat.name : undefined"
                    :user-id="
                      chat.type === 'direct' ? chat.recipient?.id : undefined
                    "
                    :src="
                      chat.type === 'group' && chat.icon
                        ? functions.avatar(chat)
                        : undefined
                    "
                    :status="chat.type === 'direct'"
                    :badge="chat.unread > 99 ? '99+' : chat.unread"
                  ></user-avatar>
                </template>
                <template #title>
                  {{ chatStore.chatName(chat) }}
                </template>
              </SideBarItem>
            </div>
          </template>
          <template v-else>
            <SideBarItem
              v-for="item in appStore.currentNavOptions"
              :key="item.name"
              class="flex h-12 items-center"
              :item="item"
            />
            <template v-if="appStore.currentRail?.id === RailMode.GALLERY">
              <tpu-overline position="start">Collections</tpu-overline>
              <div
                v-for="collection in collectionsStore.items"
                :key="collection.id"
              >
                <SideBarItem
                  class="flex h-12 items-center"
                  :to="`/collections/${collection.id}`"
                >
                  <template #title>
                    {{ collection.name }}
                  </template>
                </SideBarItem>
              </div>
            </template>
          </template>
        </div>
      </div>
    </Transition>
    <Transition name="slide-fade" mode="out-in">
      <div class="flex-col flex gap-y-2 px-3" :key="appStore.currentRail?.id">
        <SideBarItem
          v-for="item in appStore.currentMiscNavOptions"
          :key="item.name"
          class="flex items-center text-medium-emphasis-dark fill-medium-emphasis-dark"
          :item="item"
        />
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
