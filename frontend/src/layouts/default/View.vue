<template>
  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import VErrorBoundary from "@/components/Core/ErrorBoundary.vue";
import Crash from "@/components/Core/CrashAlt.vue";
import { ref } from "vue";
const skullCrash = Crash;
const error = ref(null);
</script>
