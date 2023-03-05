<template>
  <v-container v-if="report">
    <DynamicCard
      image="https://i.troplo.com/i/4e47afa9b60f.png"
      style="cursor: default"
      height="250px"
    >
      <v-card-text
        style="position: absolute; bottom: 0; left: 0; font-size: 18px"
      >
        {{ $date(report.startDate).format("Do MMM") }} -
        {{ $date(report.endDate).format("Do MMM") }}
      </v-card-text>
    </DynamicCard>
    <v-row class="mt-2">
      <v-col cols="12" sm="12" md="4" lg="5" xl="3">
        <InsightsStatsCard
          title="Uploads last week"
          :count="report.data.uploads.total.now"
          :last="report.data.uploads.total.previous"
          :difference="
            report.data.uploads.total.now - report.data.uploads.total.previous
          "
        ></InsightsStatsCard>
      </v-col>
      <v-col cols="12" sm="12" md="5" lg="6" xl="4">
        <InsightsStatsCard
          title="Uploads per hour"
          :subtitle="`Last week you uploaded the most at ${Object.keys(
            report.data.uploads.hours
          ).reduce((a, b) =>
            report.data.uploads.hours[a] > report.data.uploads.hours[b] ? a : b
          )}!`"
        >
          <Chart
            title="Uploads last week"
            :data="objectToGraphData(report.data.uploads.hours)"
            type="bar"
            :height="300"
            class="mb-n12"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col cols="12" sm="12" md="3" lg="3" xl="3">
        <InsightsStatsCard
          title="Uploads per day"
          :subtitle="`Last week you uploaded the most on ${report.data.uploads.std.stdDeezer}`"
        >
          <Chart
            title="Uploads last week"
            :data="objectToGraphData(report.data.uploads.days)"
            type="bar"
            :height="300"
            class="mb-n12"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-card>
      <v-card-text>
        You have no data for this week. Please check back later.
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DynamicCard from "@/components/Core/DynamicCard.vue";
import InsightsStatsCard from "@/components/Insights/StatsCard.vue";
import { Insight } from "@/models/insight";
import Chart from "@/components/Core/Chart.vue";

export default defineComponent({
  name: "Dynamic",
  components: { Chart, InsightsStatsCard, DynamicCard },
  data() {
    return {
      report: null as Insight | null
    };
  },
  methods: {
    objectToGraphData(object: any) {
      const labels = [];
      const data = [];
      for (const [key, value] of Object.entries(object)) {
        labels.push(key);
        data.push(value);
      }
      return { labels, data };
    },
    getReport() {
      this.$app.componentLoading = true;
      this.axios
        .get("/pulse/insights/v2/weekly")
        .then((res) => {
          this.report = res.data;
          this.$app.componentLoading = false;
        })
        .catch(() => {
          this.$app.componentLoading = false;
        });
    }
  },
  mounted() {
    this.getReport();
  }
});
</script>

<style scoped></style>
