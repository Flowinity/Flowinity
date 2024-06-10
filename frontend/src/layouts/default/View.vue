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

<!--<script lang="ts" setup>-->
<!--import Crash from "@/components/Core/CrashAlt.vue";-->
<!--import { ref } from "vue";-->

<!--const skullCrash = Crash;-->
<!--const error = ref(null);-->
<!--</script>-->
