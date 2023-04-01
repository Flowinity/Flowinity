<template>
  <div :id="'chartnext-' + id">
    <apexchart
      :type="type"
      :options="chartOptions"
      :series="series"
      :height="height"
      :width="getWidth()"
    ></apexchart>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Chart",
  props: ["data", "height", "width", "type", "id", "name", "color"],
  computed: {
    chartOptions() {
      return {
        stroke: {
          colors: [this.color || this.$user.theme.colors.primary]
        },
        colors: [this.color || this.$user.theme.colors.primary],
        grid: {
          borderColor: "#474747"
        },
        dataLabels: {
          enabled: false
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
          markers: {
            colors: ["white"],
            size: 4,
            color: "white",
            strokeColors: "#fff"
          },
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
  },
  methods: {
    getWidth() {
      if (this.width) return this.width;
      return "100%";
    }
  }
});
</script>
