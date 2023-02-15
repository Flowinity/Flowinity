<template>
  <Line
    :options="chartOptions"
    :data="data"
    v-if="data"
    :style="
      maxHeight ? `max-height: ${maxHeight}px; height: ${maxHeight}px` : ''
    "
  />
</template>

<script lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
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
  name: "LineChart",
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
