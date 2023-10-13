<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import SuperBar from "@/layouts/default/SuperBar.vue";
import SideBar from "@/layouts/default/SideBar.vue";
import AppBar from "@/layouts/default/AppBar.vue";
</script>
<template>
  <div class="dark">
    <div
      class="dark:bg-dark bg-white text-black dark:text-white flex fill-white overflow-auto"
    >
      <super-bar />
      <side-bar class="" />
      <div class="flex">
        <div class="w-full">
          <app-bar />
          <main>
            <RouterView />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>
