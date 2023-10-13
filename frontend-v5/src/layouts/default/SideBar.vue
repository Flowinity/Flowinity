<script setup lang="ts">
import { RailMode, useAppStore } from "@/stores/app.store";
import SideBarItem from "@/components/Core/Navigation/SideBarItem.vue";
import { useChatStore } from "@/stores/chat.store";

const appStore = useAppStore();
const chatStore = useChatStore();
</script>

<template>
  <aside
    class="border-r-2 h-screen dark:border-outline-dark dark:bg-sidebar-dark p-3 border-dark space-x-1 flex flex-col overflow-y-auto"
    style="min-width: 256px; max-width: 256px"
  >
    <div v-if="appStore.currentRail" class="flex ml-4 items-center">
      <component :is="appStore.currentRail?.icon" class="w-8" />
      <p class="text-xl font-semibold ml-4">
        {{ appStore.currentRail.name }}
      </p>
    </div>
    <div class="flex justify-between flex-col mt-6 flex-1">
      <div class="flex-col flex gap-y-2 flex-1">
        <template v-if="appStore.currentRail?.id === RailMode.CHAT">
          <div v-for="chat in chatStore.chats">deez</div>
        </template>
        <template v-else>
          <SideBarItem
            v-for="item in appStore.currentNavOptions"
            :key="item.name"
            class="flex h-12 items-center"
            :item="item"
          />
        </template>
      </div>
    </div>
    <div class="flex-col flex gap-y-2">
      <SideBarItem
        v-for="item in appStore.currentMiscNavOptions"
        :key="item.name"
        class="flex items-center text-medium-emphasis-dark fill-medium-emphasis-dark"
        :item="item"
      />
    </div>
  </aside>
</template>

<style scoped></style>
