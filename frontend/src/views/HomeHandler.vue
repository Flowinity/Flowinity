<template>
  <UnauthHome v-if="!$user.user" />
  <Home v-else-if="!$experiments.experiments.PROGRESSIVE_HOME" />
  <ProgressiveHome v-else />
</template>

<script lang="ts" setup>
import Home from "@/views/Home.vue";
import ProgressiveHome from "@/views/ProgressiveHome.vue";
import UnauthHome from "@/views/Auth/Home.vue";
</script>
