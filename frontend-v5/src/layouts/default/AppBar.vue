<template>
  <div
    class="border-b-2 dark:border-outline-dark"
    style="width: calc(100vw - 72px - 256px)"
  >
    <p class="flex items-center p-4">
      <component
        :is="appStore.currentNavItem?.rail.icon"
        class="w-8 mr-2 fill-medium-emphasis-dark"
      />
      <span class="text-medium-emphasis-dark">
        {{ appStore.currentNavItem?.rail.name || "Dashboard" }}
      </span>
      <RiArrowRightSLine class="w-6 mx-3 fill-medium-emphasis-dark" />
      <component :is="appStore.currentNavItem?.item.icon" class="w-8 mr-2" />
      {{ appStore.currentNavItem?.item.name || "Dashboard" }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app.store";
import { RiArrowRightSLine } from "vue-remix-icons";

const appStore = useAppStore();
</script>

<style scoped></style>
