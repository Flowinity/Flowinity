<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import SuperBar from "@/layouts/default/SuperBar.vue";
import SideBar from "@/layouts/default/SideBar.vue";
import AppBar from "@/layouts/default/AppBar.vue";
import TpuNavigationDrawer from "@/components/Framework/NavigationDrawer/TpuNavigationDrawer.vue";
import { useAppStore } from "@/stores/app.store";
import { useUserStore } from "@/stores/user.store";
import MemberSideBar from "@/layouts/default/MemberSideBar.vue";
import QuickSwitcher from "@/components/QuickSwitcher/QuickSwitcher.vue";
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import { useFrameworkStore } from "@/stores/framework.store";

const appStore = useAppStore();
const userStore = useUserStore();
const route = useRoute();
const frameworkStore = useFrameworkStore();

function drop(e: Event) {
  if (!e.dataTransfer.files?.length) return;
  e.preventDefault();
  appStore.dialogs.gallery.upload.files.push(
    ...Array.from(e.dataTransfer.files)
  );
  appStore.upload();
}
</script>
<template>
  <div class="dark w-full">
    <div
      class="dark:bg-dark bg-white text-black dark:fill-white dark:text-white flex w-full"
      @drop="drop"
      @dragover.prevent
      id="main-area"
    >
      <quick-switcher v-model="appStore.dialogs.core.quickSwitcher.value" />
      <tpu-navigation-drawer
        v-model="appStore.drawer"
        class="flex"
        v-if="userStore.user && frameworkStore.breakpoints.mobile"
      >
        <super-bar class="fixed top-0 left-0" :drawer="true" />
        <side-bar class="fixed top-0 left-0" :drawer="true" />
      </tpu-navigation-drawer>
      <super-bar
        class="fixed top-0 left-0 z-50"
        v-if="userStore.user && !frameworkStore.breakpoints.mobile"
      />
      <div class="flex w-full">
        <side-bar
          class="fixed top-0 left-0"
          v-if="userStore.user && !frameworkStore.breakpoints.mobile"
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
        <member-side-bar
          class="fixed top-0 left-0 max-sm:hidden"
          v-if="route.path.startsWith('/communications/')"
        />
      </div>
    </div>
  </div>
</template>
