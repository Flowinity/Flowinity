<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import SuperBar from "@/layouts/default/SuperBar.vue";
import SideBar from "@/layouts/default/SideBar.vue";
</script>

<template>
  <div class="dark">
    <div
      class="dark:bg-dark h-screen bg-white text-black dark:text-white flex fill-white"
    >
      <super-bar />
      <side-bar />
      <RouterView />
    </div>
  </div>
</template>
