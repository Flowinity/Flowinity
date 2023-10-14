<template>
  <div
    class="border-b-2 w-full dark:border-outline-dark dark:bg-dark sticky top-0 z-50"
  >
    <p class="flex items-center p-4">
      <Transition mode="out-in" name="slide-up">
        <span
          class="flex items-center"
          :key="appStore.currentNavItem?.rail?.id"
        >
          <component
            :is="appStore.currentNavItem?.rail?.icon"
            class="w-8 mr-2 fill-medium-emphasis-dark"
            v-if="appStore.currentNavItem?.rail?.icon"
          />
          <span class="text-medium-emphasis-dark">
            {{ appStore.currentNavItem?.rail?.name || "Dashboard" }}
          </span>
          <RiArrowRightSLine class="w-6 mx-3 fill-medium-emphasis-dark" />
        </span>
      </Transition>
      <Transition mode="out-in" name="slide-up">
        <span class="flex items-center" :key="appStore.currentNavItem?.item">
          <component
            :is="appStore.currentNavItem?.item.icon"
            class="w-8 mr-2"
          />
          {{ appStore.currentNavItem?.item.name || "Dashboard" }}
        </span>
      </Transition>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app.store";
import { RiArrowRightSLine } from "vue-remix-icons";

const appStore = useAppStore();
</script>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.1s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
