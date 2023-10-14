<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import SuperBar from "@/layouts/default/SuperBar.vue";
import SideBar from "@/layouts/default/SideBar.vue";
import AppBar from "@/layouts/default/AppBar.vue";
</script>
<template>
  <div class="dark w-full">
    <div
      class="dark:bg-dark bg-white text-black dark:fill-white dark:text-white flex w-full"
    >
      <super-bar class="fixed top-0 left-0 z-50" />
      <div class="flex w-full">
        <side-bar class="fixed top-0 left-0" />
        <div class="flex flex-col w-full">
          <app-bar class="bg-white z-10" />
          <main class="w-full overflow-auto p-4">
            <RouterView />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>
