<script setup lang="ts">
import { RouterView } from "vue-router";
import SuperBar from "@/layouts/default/SuperBar.vue";
import SideBar from "@/layouts/default/SideBar.vue";
import AppBar from "@/layouts/default/AppBar.vue";
import TpuNavigationDrawer from "@/components/Core/NavigationDrawer/TpuNavigationDrawer.vue";
import { useAppStore } from "@/stores/app.store";
import { useUserStore } from "@/stores/user.store";

const appStore = useAppStore();
const userStore = useUserStore();
</script>
<template>
  <div class="dark w-full">
    <div
      class="dark:bg-dark bg-white text-black dark:fill-white dark:text-white flex w-full"
    >
      <tpu-navigation-drawer
        v-model="appStore.drawer"
        class="flex"
        v-if="userStore.user"
      >
        <super-bar class="fixed top-0 left-0" :drawer="true" />
        <side-bar class="fixed top-0 left-0" :drawer="true" />
      </tpu-navigation-drawer>
      <super-bar
        class="fixed top-0 left-0 z-50 max-sm:hidden"
        v-if="userStore.user"
      />
      <div class="flex w-full">
        <side-bar
          class="fixed top-0 left-0 max-sm:hidden"
          v-if="userStore.user"
        />
        <div class="flex flex-col w-full">
          <app-bar class="bg-white z-10" />
          <main
            class="w-full overflow-auto"
            :class="appStore.heightOffset"
            id="app-area"
          >
            <RouterView />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>
