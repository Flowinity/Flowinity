<template>
  <div :id="'chartnext-' + id">
    <apexchart
      :type="type"
      :options="chartOptions"
      :series="seriesRes"
      :height="height"
      :width="getWidth()"
      title=""
    ></apexchart>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Chart",
  props: [
    "data",
    "height",
    "width",
    "type",
    "id",
    "name",
    "color",
    "series",
    "horizontal"
  ],
  computed: {
    chartOptions() {
      const result = {
        plotOptions: {
          bar: {
            horizontal: this.horizontal || false
          }
        },
        c: this.series,
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
        xaxis: undefined as any
      };
      if (!this.series) {
        result.xaxis = {
          categories: this.data.labels
        };
      }
      return result;
    },
    seriesRes() {
      return !this.series
        ? [
            {
              name: this.name || "TPUvNEXT-Default",
              data: this.data.data
            }
          ]
        : this.series;
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
