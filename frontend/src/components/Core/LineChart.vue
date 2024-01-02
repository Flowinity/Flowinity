<template>
  <Line
    v-if="data"
    :data="data"
    :options="chartOptions"
    :style="
      maxHeight ? `max-height: ${maxHeight}px; height: ${maxHeight}px` : ''
    "
  />
</template>

<script lang="ts">
import { Line } from "vue-chartjs";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { defineComponent } from "vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

export default defineComponent({
  components: { Line },
  props: ["data", "maxHeight"],
  computed: {
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: !this.maxHeight,
        title: {
          display: false
        }
      };
    }
  },
  mounted() {
    console.log(this.data);
  }
});
</script>
