<template>
  <Home v-if="!$experiments.experiments.PROGRESSIVE_HOME" />
  <ProgressiveHome v-else />
</template>

<script lang="ts" setup>
import Home from "@/views/Home.vue";
import ProgressiveHome from "@/views/ProgressiveHome.vue";
</script>
