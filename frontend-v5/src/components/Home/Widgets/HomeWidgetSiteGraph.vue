<template>
  <card outlined padding>
    <template #header>Flowinity Statistics</template>
    <div
      class="grid 2xl:grid-cols-4 sm:grid-cols-3 gap-4 mt-4"
      v-if="appStore.state?.stats"
    >
      <tpu-chart
        v-if="appStore.state.stats.uploadGraph"
        :data="appStore.state.stats.uploadGraph"
        name="Uploads"
        :height="420"
      />
    </div>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import { useAppStore } from "@/stores/app.store";
import { useUserStore } from "@/stores/user.store";
import TpuChart from "@/components/Framework/Chart/TpuChart.vue";

const appStore = useAppStore();
const userStore = useUserStore();
</script>

<style scoped></style>
