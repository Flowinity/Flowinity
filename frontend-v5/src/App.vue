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
import Stats from "stats.js";
import { useChatStore } from "@/stores/chat.store";

const appStore = useAppStore();
const userStore = useUserStore();
const route = useRoute();
const frameworkStore = useFrameworkStore();
const chatStore = useChatStore();

function drop(e: Event) {
  if (!e.dataTransfer.files?.length) return;
  e.preventDefault();
  appStore.dialogs.gallery.upload.files.push(
    ...Array.from(e.dataTransfer.files)
  );
  appStore.upload();
}

const stats = new Stats();
//FPS and MS
stats.showPanel(0);
stats.dom.style.position = "fixed";
stats.dom.style.left = "unset";
stats.dom.style.right = "0";
stats.dom.style.top = "unset";
stats.dom.style.bottom = "0";
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();

  // monitored code goes here

  stats.end();

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
</script>
<template>
  <div class="dark w-full">
    <div
      id="main-area"
      class="dark:bg-dark bg-white text-black dark:fill-white dark:text-white flex w-full"
      @drop="drop"
      @dragover.prevent
    >
      <quick-switcher v-model="appStore.dialogs.core.quickSwitcher.value" />
      <tpu-navigation-drawer
        v-if="userStore.user && frameworkStore.breakpoints.mobile"
        v-model="appStore.drawer"
        class="flex"
      >
        <super-bar class="fixed top-0 left-0" :drawer="true" />
        <side-bar class="fixed top-0 left-0" :drawer="true" />
      </tpu-navigation-drawer>
      <super-bar
        v-if="userStore.user && !frameworkStore.breakpoints.mobile"
        class="fixed top-0 left-0 z-50"
      />
      <div id="main-flex" class="flex w-full">
        <side-bar
          v-if="userStore.user && !frameworkStore.breakpoints.mobile"
          class="fixed top-0 left-0"
        />
        <div class="flex flex-col w-full">
          <app-bar class="bg-white z-10" />
          <main
            id="app-area"
            class="w-full overflow-auto"
            :class="appStore.heightOffset"
          >
            <RouterView />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>
