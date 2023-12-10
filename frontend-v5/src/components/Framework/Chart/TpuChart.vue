<template>
  <div :key="chartJSData">
    <Bar
      v-if="type === 'bar'"
      :data="chartJSData"
      :options="chartJSOptions"
      style="width: 100%"
      :style="{
        height: getHeight,
        maxHeight: getHeight,
        minHeight: getHeight,
        width: getWidth,
        maxWidth: getWidth,
        minWidth: getWidth
      }"
    />
    <Line
      v-else
      :data="chartJSData"
      :options="chartJSOptions"
      :style="{
        height: getHeight,
        maxHeight: getHeight,
        minHeight: getHeight,
        width: getWidth,
        maxWidth: getWidth,
        minWidth: getWidth
      }"
    />
  </div>
</template>

<script lang="ts" setup>
//@ts-ignore
import { Bar, Line } from "vue-chartjs";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { computed, ref } from "vue";
import { useExperimentsStore } from "@/stores/experiments.store";
import { useUserStore } from "@/stores/user.store";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement
);

const props = defineProps([
  "data",
  "height",
  "width",
  "type",
  "id",
  "name",
  "color",
  "series",
  "horizontal"
]);

const getHeight = computed(() => {
  return props.height ? props.height + "px" : undefined;
});

const gradient = ref("");

const getGradient = (ctx: any, chartArea: any) => {
  let width, height, gradient;
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;

  if (!gradient || width !== chartWidth || height !== chartHeight) {
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, "#ff4e50");
    gradient.addColorStop(0.5, "#ffd700");
    gradient.addColorStop(1, "#0190ea");
  }

  gradient.value = gradient;
  return gradient.value;
};

const experimentsStore = useExperimentsStore();
const userStore = useUserStore();

const chartJSData = ref({
  labels: props.data?.labels,
  datasets: [
    {
      label: props.name,
      data: props.data?.data,
      borderColor: (context: any) => {
        if (!experimentsStore.experiments.PRIDE)
          return props.color || "#0190ea";
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        return getGradient(ctx, chartArea);
      },
      backgroundColor: () => {
        if (!experimentsStore.experiments.PRIDE)
          return props.color || "#0190ea";
        return gradient.value;
      }
    }
  ]
});

const getWidth = computed(() => {
  return props.width ? props.width : "100%";
});

const chartJSOptions = {
  elements: {
    line: {
      tension: 0.1
    }
  },
  width: getWidth,
  responsive: true,
  maintainAspectRatio: !props.height,
  title: {
    display: false
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: "index",
      intersect: false
    },
    hover: {
      mode: "index",
      intersect: false
    }
  },
  animation: {
    duration: 1
  }
};

const seriesRes = !props.series
  ? [
      {
        name: props.name || "TPUvNEXT-Default",
        data: props.data.data
      }
    ]
  : props.series;
</script>
