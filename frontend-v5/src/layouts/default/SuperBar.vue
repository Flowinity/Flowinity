<script setup lang="ts">
import { useAppStore } from "@/stores/app.store";
import SuperBarItem from "@/components/Core/Navigation/SuperBarItem.vue";
import RiSearchLine from "vue-remix-icons/icons/ri-search-line.vue";
import RiSettings5Line from "vue-remix-icons/icons/ri-settings-5-line.vue";

const appStore = useAppStore();
const props = defineProps({
  drawer: Boolean
});
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
          <img src="@/assets/flowinity.svg" alt="Flowinity Logo" />
          <super-bar-item :highlighted="true">
            <RiSearchLine />
          </super-bar-item>
        </div>
        <div
          class="divide-outline-dark border border-outline-dark mt-4 w-full"
        />
        <div class="flex flex-col gap-y-2 mt-4">
          <super-bar-item
            v-for="item in appStore.navigation.railOptions"
            :key="item.id"
            :selected="appStore.navigation.mode === item.id"
            @click="appStore.navigation.mode = item.id"
            class="text-gray"
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
        <div class="flex flex-col gap-y-4">
          <super-bar-item :highlighted="true">
            <RiSettings5Line />
          </super-bar-item>
          <img
            class="rounded-full"
            src="https://i.troplo.com/i/50ba79e4.png"
            alt="Profile picture"
          />
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped></style>
