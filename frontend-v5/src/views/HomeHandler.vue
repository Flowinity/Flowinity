<template>
  <component
    :is="inited ? Transition : 'div'"
    name="dialog-transition"
    mode="out-in"
  >
    <home v-if="userStore.token" />
    <landing-page v-else />
  </component>
</template>

<script setup lang="ts">
import Home from "@/views/Home.vue";
import LandingPage from "@/views/LandingPage.vue";
import { useUserStore } from "@/stores/user.store";
import { nextTick, ref, Transition } from "vue";

const userStore = useUserStore();
const inited = ref(false);

nextTick(() => {
  inited.value = true;
});
</script>

<style scoped></style>
