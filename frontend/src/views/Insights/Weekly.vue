<template>
  <v-container v-if="report">
    <DynamicCard style="cursor: default" height="250px" :image="strings.banner">
      <v-card-text
        style="position: absolute; bottom: 0; left: 0; font-size: 18px"
        class="unselectable"
      >
        <span :class="{ 'text-black': type === 'weekly' }" style="z-index: 2">
          {{ $date(report.startDate).format("Do MMM") }} -
          {{ $date(report.endDate).format("Do MMM") }}
        </span>
      </v-card-text>
    </DynamicCard>
    <div class="d-flex justify-center">
      <v-btn class="mb-n3 mt-1">
        <v-icon class="mr-1">mdi-arrow-left</v-icon>
        Last {{ strings.singular }}
      </v-btn>
      <div class="text-center mb-n3 mt-3" style="flex: 1">
        <p>
          {{ $date(report.startDate).format("Do MMMM YYYY") }} -
          {{ $date(report.endDate).format("Do MMMM YYYY") }}
        </p>
      </div>
      <v-btn class="mb-n3 mt-1 float-right">
        Next {{ strings.singular }}
        <v-icon class="ml-1">mdi-arrow-right</v-icon>
      </v-btn>
    </div>
    <v-row class="mt-2">
      <v-col cols="12" sm="12" md="4" lg="5" xl="2">
        <InsightsStatsCard
          :title="`Uploads last ${strings.singular}`"
          :count="report?.data.uploads.total.now"
          :last="report?.data.uploads.total.previous"
          :difference="
            report?.data.uploads.total.now - report.data.uploads.total.previous
          "
        ></InsightsStatsCard>
        <InsightsStatsCard
          class="mt-4"
          :title="`Messages last ${strings.singular}`"
          :count="report?.data.messages.total.now"
          :last="report?.data.messages.total.previous"
          :difference="
            report?.data.messages.total.now -
            report.data.messages.total.previous
          "
        ></InsightsStatsCard>
      </v-col>
      <v-col cols="12" sm="12" md="4" lg="5" xl="2">
        <InsightsStatsCard
          title="Uploads/day (avg)"
          :count="report?.data.uploads.average.now ?? 0"
          :last="report?.data.uploads.average.previous ?? 0"
          :difference="
            report?.data.uploads.average.now -
            report.data.uploads.average.previous
          "
        ></InsightsStatsCard>
        <InsightsStatsCard
          class="mt-4"
          title="Messages/day (avg)"
          :count="report?.data.messages.average.now ?? 0"
          :last="report?.data.messages.average.previous ?? 0"
          :difference="
            report?.data.messages.average.now -
              report.data.messages.average.previous ?? 0
          "
        ></InsightsStatsCard>
      </v-col>
      <v-col cols="12" sm="12" md="5" lg="6" xl="4">
        <InsightsStatsCard
          title="Uploads per hour"
          :subtitle="`Last week you uploaded the most at ${Object.keys(
            report?.data.uploads.hours
          ).reduce((a, b) =>
            //@ts-ignore
            report?.data?.uploads?.hours[a] ??
            //@ts-ignore
            0 > report?.data?.uploads?.hours[b] ??
            0
              ? a
              : b
          )}!`"
        >
          <Chart
            title="Uploads last week"
            :data="objectToGraphData(report?.data.uploads.hours.now)"
            type="bar"
            :height="300"
            class="mb-n6"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col cols="12" sm="12" md="3" lg="5" xl="4">
        <InsightsStatsCard
          title="Uploads per day"
          :subtitle="`Last week you uploaded the most on ${
            report?.data.uploads.days.series[0].data.reduce((a, b) =>
              a > b ? a : b
            ).x
          }!`"
        >
          <Chart
            title="Uploads last week"
            type="bar"
            :height="300"
            class="mb-n6"
            :series="report?.data.uploads.days.series"
            name="uploads-last-week"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col cols="12" sm="12" md="3" lg="5" xl="4">
        <InsightsStatsCard
          title="Top 500 words"
          subtitle="See the top words in your screenshots!"
        >
          <v-data-table
            :headers="headers.words"
            :items="report?.data.uploads.words"
            :items-per-page="4"
            class="text-left"
            :sort-by="[{ key: 'count', order: 'desc' }]"
          >
            <template v-slot:item.word="{ item }">
              <div class="limit" style="max-width: 200px">
                {{ item.value.word }}
              </div>
            </template>
            <template v-slot:item.count="{ item }">
              <div class="limit">
                {{ item.value.count }}
              </div>
            </template>
          </v-data-table>
        </InsightsStatsCard>
      </v-col>
      <v-col cols="12" sm="12" md="3" lg="5" xl="4">
        <InsightsStatsCard
          title="Feature usage"
          subtitle="Explore what TPU features you use the most!"
        >
          <Chart
            type="bar"
            :horizontal="true"
            :height="300"
            class="mb-n6"
            :data="arrayToGraphData(report?.data.pulses.features)"
            name="Hours"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col cols="12" sm="12" md="3" lg="5" xl="4">
        <InsightsStatsCard
          title="Platform usage"
          subtitle="See what platforms you use TPU on."
        >
          <Chart
            type="bar"
            :horizontal="true"
            :height="300"
            class="mb-n6"
            :data="objectToGraphData(report?.data.pulses.platforms)"
            name="Hours"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col cols="12" sm="12" md="3" lg="5" xl="4">
        <InsightsStatsCard
          title="Website usage"
          subtitle="See what days you used TPU!"
        >
          <Chart
            type="bar"
            :height="300"
            class="mb-n6"
            :data="objectToGraphData(report?.data.pulses.days)"
            name="Hours"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col cols="12" sm="12" md="3" lg="5" xl="4">
        <InsightsStatsCard
          title="Top chats"
          subtitle="See who you talk to in TPU Communications!"
        >
          <v-data-table
            :headers="headers.topChats"
            :items="report?.data.messages.topChats"
            :items-per-page="4"
            class="text-left"
            :sort-by="[{ key: 'count', order: 'desc' }]"
          >
            <template v-slot:item.word="{ item }">
              <div class="limit" style="max-width: 200px">
                {{ item.value.word }}
              </div>
            </template>
            <template v-slot:item.count="{ item }">
              <div class="limit">
                {{ item.value.count }}
              </div>
            </template>
          </v-data-table>
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
import InsightsPageBanner from "@/components/Insights/Banners/Page.vue";
import PlaceholderCheckerboard from "@/components/Core/PlaceholderCheckerboard.vue";

export default defineComponent({
  name: "Dynamic",
  components: {
    PlaceholderCheckerboard,
    InsightsPageBanner,
    Chart,
    InsightsStatsCard,
    DynamicCard
  },
  data() {
    return {
      headers: {
        topChats: [
          { title: "Chat", key: "chatName" },
          { title: "Count", key: "count", order: "desc" }
        ],
        words: [
          { title: "Word", key: "word" },
          { title: "Count", key: "count", order: "desc" }
        ]
      },
      report: null as Insight | null,
      reports: [] as Insight[]
    };
  },
  computed: {
    type() {
      return this.$route.params.type;
    },
    strings() {
      switch (this.type) {
        case "weekly":
          return {
            banner: "https://i.troplo.com/i/4edb6d006e06.png",
            plural: "weeks",
            singular: "week"
          };
        case "monthly":
          return {
            banner: "https://i.troplo.com/i/1f91557f0dc4.png",
            plural: "months",
            singular: "month"
          };
        case "yearly":
          return {
            banner: "https://i.troplo.com/i/34b61673eac5.png",
            plural: "years",
            singular: "year"
          };
        case "dynamic":
          return {
            banner: "https://i.troplo.com/i/c0bc710f80cf.png",
            plural: "all time",
            singular: "all time"
          };
        default:
          return {
            banner: "https://i.troplo.com/i/4edb6d006e06.png",
            plural: "weeks",
            singular: "week"
          };
      }
    }
  },
  methods: {
    arrayToGraphData(array: { name: string; count: number }[] | undefined) {
      if (!array) return { labels: [], data: [] };
      // sort by count
      const labels = [];
      const data = [];
      for (const item of array) {
        labels.push(item.name);
        data.push(item.count);
      }
      const otherIndex = labels.indexOf("Other");
      if (otherIndex !== -1) {
        labels.push(labels.splice(otherIndex, 1)[0]);
        data.push(data.splice(otherIndex, 1)[0]);
      }
      return {
        labels,
        data
      };
    },
    objectToGraphData(object: any, object2?: any) {
      if (!object2) {
        const labels = [];
        const data = [];
        for (const [key, value] of Object.entries(object)) {
          labels.push(key);
          data.push(value);
        }
        return { labels, data };
      } else {
        /* do this, with the goals being the object2  series: [
        {
          name: string
          data: {
            x: string
            y: number
            goals: {
              name: string
              value: number
            }[]
          }[]
        }
      ]
         */
        const data = [];
        for (const [key, value] of Object.entries(object)) {
          data.push({
            name: key,
            data: value,
            goals: [
              {
                name: key,
                value: object2[key]
              }
            ]
          });
        }
        return {
          data,
          name: "Uploads"
        };
      }
    },
    getReports() {
      this.axios
        .get(`/pulse/insights/v2/reports`)
        .then((res) => {
          this.reports = res.data;
          this.$app.componentLoading = false;
        })
        .catch(() => {
          this.$app.componentLoading = false;
        });
    },
    getReport() {
      this.$app.componentLoading = true;
      this.axios
        .get(`/pulse/insights/v2/${this.$route.params.type}`)
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
    this.getReports();
  }
});
</script>

<style scoped></style>
