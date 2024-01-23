<template>
  <card outlined padding>
    <template #header>{{ t("home.widgets.statistics.title") }}</template>
    <div
      v-if="appStore.state?.stats"
      class="grid 2xl:grid-cols-4 sm:grid-cols-3 gap-4 mt-4"
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
import TpuChart from "@/components/Framework/Chart/TpuChart.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const appStore = useAppStore();
</script>

<style scoped></style>
