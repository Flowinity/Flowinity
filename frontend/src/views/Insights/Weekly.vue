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
      <v-col cols="12" sm="12" md="4" lg="3">
        <InsightsStatsCard
          title="Uploads last week"
          :count="report.data.uploads.total.now"
          :last="report.data.uploads.total.previous"
          :difference="
            report.data.uploads.total.now - report.data.uploads.total.previous
          "
        ></InsightsStatsCard>
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

export default defineComponent({
  name: "Dynamic",
  components: { InsightsStatsCard, DynamicCard },
  data() {
    return {
      report: null as Insight | null
    };
  },
  methods: {
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
