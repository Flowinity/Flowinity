<template>
  <Bar
    v-if="data"
    :data="data"
    :options="chartOptions"
    :style="
      maxHeight ? `max-height: ${maxHeight}px; height: ${maxHeight}px` : ''
    "
  />
</template>

<script lang="ts">
import {Bar} from "vue-chartjs"
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
} from "chart.js"
import {defineComponent} from "vue"

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement
)

export default defineComponent({
  name: "BarChart",
  components: {Bar},
  props: ["data", "maxHeight"],
  computed: {
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: !this.maxHeight,
        title: {
          display: false
        }
      }
    }
  },
  mounted() {
    console.log(this.data)
  }
})
</script>
