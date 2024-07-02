<template>
  <v-main id="main">
    <div id="main-first" />
    <router-view v-slot="{ Component }">
      <keep-alive include="ChatLayout">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </v-main>
</template>

<script lang="ts" setup>
import Crash from "@/components/Core/CrashAlt.vue";
import { nextTick, onBeforeUnmount, onMounted, onUnmounted, ref } from "vue";
import { useProgressiveUIStore } from "@/store/progressive.store";

const uiStore = useProgressiveUIStore();

onMounted(async () => {
  await nextTick();
  uiStore.loggedInViewReady = true;
});

onBeforeUnmount(() => {
  uiStore.loggedInViewReady = false;
});
</script>
