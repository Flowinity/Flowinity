<template>
  <v-card-text class="text-overline">Statistics</v-card-text>
  <v-card-text>
    <v-row>
      <v-col :md="!username ? 6 : 12" cols="12" sm="12">
        <v-card
          v-if="hoursMost"
          :height="$vuetify.display.mobile ? 415 : undefined"
          class="text-center mt-n4"
        >
          <p class="mt-3">
            <strong
              class="text-gradient-custom text-gradient"
              style="font-size: 24px"
            >
              Upload Distribution
            </strong>
          </p>
          <v-card-subtitle>
            {{ user.username }} uploads the most at {{ hoursMost.hour }} with
            {{ hoursMost.count }} uploads!
          </v-card-subtitle>
          <Chart
            v-if="hoursGraph"
            id="userv2-hours"
            :color="primaryColorResult"
            :data="hoursGraph"
            :height="346.5"
            :max-height="$vuetify.display.mobile ? 346 : undefined"
            name="Uploads"
            type="bar"
            class="ml-3 mr-3"
          ></Chart>
        </v-card>
      </v-col>
      <v-col :md="!username ? 6 : 12" cols="12" sm="12">
        <div
          v-if="user.stats.uploadGraph"
          :height="$vuetify.display.mobile ? 415 : undefined"
          max-height="415"
          class="mt-n4"
        >
          <GraphWidget
            :card-height="415"
            :gold="gold"
            :height="300"
            :message-graph="user.stats.messageGraph"
            :primary-color="primaryColorResult"
            :pulse-graph="user.stats.pulseGraph"
            :upload-graph="user.stats.uploadGraph"
            :cache="false"
          ></GraphWidget>
        </div>
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
