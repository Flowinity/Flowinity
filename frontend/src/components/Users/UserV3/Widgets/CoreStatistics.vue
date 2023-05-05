<template>
  <v-card-text class="text-overline">Statistics</v-card-text>
  <v-card-text>
    <v-row>
      <v-col sm="12" :md="!username ? 6 : 12" cols="12">
        <v-card
          class="text-center mt-n6"
          v-if="hoursMost"
          :height="$vuetify.display.mobile ? 400 : undefined"
        >
          <p class="mt-3">
            <strong style="font-size: 24px" class="text-gradient">
              Upload Distribution
            </strong>
          </p>
          <v-card-subtitle>
            {{ user.username }} uploads the most at {{ hoursMost.hour }} with
            {{ hoursMost.count }} uploads!
          </v-card-subtitle>
          <Chart
            id="userv2-hours"
            :data="hoursGraph"
            v-if="hoursGraph"
            :max-height="$vuetify.display.mobile ? 320 : undefined"
            :height="320"
            type="bar"
            :color="primaryColorResult"
            name="Uploads"
          ></Chart>
        </v-card>
      </v-col>
      <v-col md="6" sm="12">
        <v-card
          class="text-center mt-n6"
          v-if="user.stats.uploadGraph"
          :height="$vuetify.display.mobile ? 400 : undefined"
          max-height="400"
        >
          <GraphWidget
            :upload-graph="user.stats.uploadGraph"
            :message-graph="user.stats.messageGraph"
            :pulse-graph="user.stats.pulseGraph"
            :card-height="400"
            :height="320"
            :primary-color="primaryColorResult"
            :gold="gold"
          ></GraphWidget>
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GraphWidget from "@/components/Dashboard/GraphWidget.vue";
import Chart from "@/components/Core/Chart.vue";

export default defineComponent({
  name: "CoreStatistics",
  components: { Chart, GraphWidget },
  props: ["user", "username", "gold", "primary"],
  computed: {
    primaryColorResult() {
      return this.$user.primaryColorResult(this.primary, this.gold).primary;
    },
    hoursMost() {
      if (this.user?.stats?.hours) {
        let hours = Object.entries(this.user.stats.hours);
        hours.sort((a: any, b: any) => b[1] - a[1]);
        return {
          hour: hours[0][0],
          count: hours[0][1]
        };
      } else {
        return null;
      }
    },
    hoursGraph() {
      if (this.user?.stats?.hours) {
        return {
          labels: Object.keys(this.user.stats.hours),
          data: Object.values(this.user.stats.hours)
        };
      } else {
        return null;
      }
    },
    chartData() {
      if (this.user?.stats?.uploadGraph) {
        return {
          labels: this.user.stats.uploadGraph.labels,
          datasets: [
            {
              label: "Uploads",
              data: this.user.stats.uploadGraph.data,
              backgroundColor: "transparent",
              borderColor: "#0190ea",
              pointBackgroundColor: "#181818"
            }
          ]
        };
      } else {
        return [];
      }
    }
  }
});
</script>

<style scoped></style>
