<script setup lang="ts">
import { useAppStore } from "@/stores/app.store";
import SuperBarItem from "@/components/Core/Navigation/SuperBarItem.vue";
import { RiSearchLine, RiSettings5Line } from "vue-remix-icons";
import { computed } from "vue";
import SideBarItem from "@/components/Core/Navigation/SideBarItem.vue";

const appStore = useAppStore();
</script>

<template>
  <div
    class="max-h-screen border-r-2 dark:border-outline-dark dark:bg-sidebar-dark w-64 p-3 border-dark space-x-1 flex flex-col"
  >
    <div v-if="appStore.currentRail" class="flex ml-4">
      <component :is="appStore.currentRail?.icon" class="w-8" />
      <p class="text-xl font-semibold ml-4">
        {{ appStore.currentRail.name }}
      </p>
    </div>
    <div class="flex justify-between flex-col mt-6 flex-1">
      <div class="flex-col flex gap-y-2 flex-1">
        <SideBarItem
          v-for="item in appStore.currentNavOptions"
          :key="item.name"
          class="flex h-12 items-center"
          :item="item"
        />
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
  </div>
</template>

<style scoped></style>
