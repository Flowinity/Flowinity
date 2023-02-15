<template>
  <apexchart
    :type="type"
    :options="chartOptions"
    :series="series"
    :height="height"
  ></apexchart>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Chart",
  props: ["data", "height", "width", "type", "id", "name"],
  computed: {
    chartOptions() {
      return {
        stroke: {
          colors: ["#0190ea"]
        },
        grid: {
          borderColor: "#474747"
        },
        bar: {
          plotOptions: {
            total: {
              show: true,
              label: "Total"
            }
          }
        },
        theme: {
          mode: "dark",
          palette: "palette1"
        },
        chart: {
          animations: {
            enabled: false,
            easing: "easeinout",
            speed: 400,
            dynamicAnimation: {
              enabled: true,
              speed: 350
            }
          },
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false
            }
          },
          background: "transparent",
          id: "chartnext-" + this.id
        },
        xaxis: {
          categories: this.data.labels
        }
      };
    },
    series() {
      return [
        {
          name: this.name || "TPUvNEXT-Default",
          data: this.data.data
        }
      ];
    }
  }
});
</script>
