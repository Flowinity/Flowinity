<template>
  <v-container v-if="report" :key="report.id">
    <DynamicCard
      style="cursor: default"
      :height="$vuetify.display.mobile ? '150px' : '250px'"
      :image="strings.banner"
    >
      <v-card-text
        style="position: absolute; bottom: 0; left: 0; font-size: 18px"
        class="unselectable"
      >
        <span :class="{ 'text-black': type === 'weekly' }" style="z-index: 2">
          <v-select
            :items="items"
            item-title="name"
            item-value="id"
            v-model="id"
            v-if="type !== 'dynamic'"
            class="mb-n6"
            :color="type === 'weekly' ? 'black' : 'white'"
            @update:model-value="getReport"
          ></v-select>
        </span>
      </v-card-text>
      <div class="float-right mb-3 mr-4" v-if="!$vuetify.display.mobile">
        <v-btn
          :to="'/insights/weekly' + requiredString"
          class="mr-2"
          :color="type === 'weekly' ? 'black' : 'white'"
        >
          Weekly
        </v-btn>
        <v-btn
          :to="'/insights/monthly' + requiredString"
          class="mr-2"
          :color="type === 'weekly' ? 'black' : 'white'"
        >
          Monthly
        </v-btn>
        <v-btn
          :to="'/insights/yearly' + requiredString"
          class="mr-2"
          :color="type === 'weekly' ? 'black' : 'white'"
        >
          Annually
        </v-btn>
        <v-btn
          :to="'/insights/dynamic' + requiredString"
          :color="type === 'weekly' ? 'black' : 'white'"
        >
          Dynamic
        </v-btn>
      </div>
    </DynamicCard>
    <div class="d-flex justify-center">
      <div class="text-center mb-n3 mt-3" style="flex: 1">
        <p>
          {{ $date(report.startDate).format("Do MMMM YYYY") }} -
          {{ $date(report.endDate).format("Do MMMM YYYY") }}
        </p>
      </div>
    </div>
    <v-row class="mt-2">
      <v-col cols="12" sm="12" md="4" lg="5" xl="2">
        <InsightsStatsCard
          :title="`Uploads`"
          :count="report?.data.uploads.total?.now"
          :last="report?.data.uploads.total?.previous"
          :difference="
            report?.data.uploads.total.now - report.data.uploads.total.previous
          "
        ></InsightsStatsCard>
        <InsightsStatsCard
          class="mt-4"
          :title="`Messages`"
          :count="report?.data.messages.total?.now"
          :last="report?.data.messages.total?.previous"
          :difference="
            report?.data.messages.total.now -
            report.data.messages.total.previous
          "
        ></InsightsStatsCard>
        <InsightsStatsCard
          class="mt-4"
          title="Current UploadStreak"
          v-if="report?.data.uploads.streak.currentStreak"
          :count="report?.data.uploads.streak.currentStreak.length"
          :subtitle="`${$date(
            report.data.uploads.streak.currentStreak.startDate
          ).format('DD/MM/YYYY')} - ${$date(
            report.data.uploads.streak.currentStreak.endDate
          ).format('DD/MM/YYYY')}`"
          :difference="
            report.data.uploads.streak.previous
              ? report.data.uploads.streak.currentStreak.length -
                report.data.uploads.streak.previous.currentStreak.length
              : undefined
          "
          :last="
            report.data.uploads.streak.previous
              ? report.data.uploads.streak.previous.currentStreak.length
              : undefined
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
        <InsightsStatsCard
          class="mt-4"
          title="Longest UploadStreak"
          v-if="report?.data.uploads.streak.longestStreak"
          :count="report?.data.uploads.streak.longestStreak.length"
          :subtitle="`${$date(
            report.data.uploads.streak.longestStreak.startDate
          ).format('DD/MM/YYYY')} - ${$date(
            report.data.uploads.streak.longestStreak.endDate
          ).format('DD/MM/YYYY')}`"
          :difference="
            report.data.uploads.streak.previous
              ? report.data.uploads.streak.longestStreak.length -
                report.data.uploads.streak.previous.longestStreak.length
              : undefined
          "
          :last="
            report.data.uploads.streak.previous?.longestStreak
              ? report.data.uploads.streak.previous.longestStreak.length
              : undefined
          "
        ></InsightsStatsCard>
      </v-col>
      <v-col cols="12" sm="12" md="5" lg="6" xl="4">
        <InsightsStatsCard
          title="Uploads per hour"
          :subtitle="`Last reporting period you uploaded the most at ${
            report?.data.uploads.hours.series[0].data.reduce((a, b) =>
              a.y > b.y ? a : b
            ).x
          }!`"
        >
          <Chart
            title="Uploads last week"
            :series="report?.data.uploads.hours.series"
            type="bar"
            :height="300"
            class="mb-n6"
          ></Chart>
        </InsightsStatsCard>
        <InsightsStatsCard
          title="Website usage"
          subtitle="See when you used TPU!"
          class="mt-6"
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
          title="Uploads per day"
          :subtitle="`Last reporting period you uploaded the most on ${
            report?.data.uploads.days.series[0].data.reduce((a, b) =>
              a.y > b.y ? a : b
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
        <InsightsStatsCard
          title="Platform usage"
          subtitle="See what platforms you use TPU on."
          class="mt-6"
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
          subtitle="See when you used TPU!"
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
      <v-col
        cols="12"
        sm="12"
        md="3"
        lg="5"
        xl="4"
        v-if="report.data.uploads.months"
      >
        <InsightsStatsCard title="Uploads per month">
          <Chart
            type="bar"
            :height="300"
            class="mb-n6"
            :series="report?.data.uploads.months.series"
            name="uploads-last-month"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="3"
        lg="5"
        xl="4"
        v-if="report.data.uploads.years"
      >
        <InsightsStatsCard title="Uploads per year">
          <Chart
            type="bar"
            :height="300"
            class="mb-n6"
            :series="report?.data.uploads.years.series"
            name="uploads-last-month"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="3"
        lg="5"
        xl="4"
        v-if="report?.data.uploads.words"
      >
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
      <v-col
        cols="12"
        sm="12"
        md="3"
        lg="5"
        xl="4"
        v-if="report?.data.messages.topChats"
      >
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
      <v-col
        cols="12"
        sm="12"
        md="3"
        lg="5"
        xl="4"
        v-if="report?.data.pulses.autoCollects"
      >
        <InsightsStatsCard title="AutoCollects per hour">
          <Chart
            type="bar"
            :height="300"
            class="mb-n6"
            :series="report?.data.pulses.autoCollects.series"
            name="autocollects-per-hour"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="3"
        lg="5"
        xl="4"
        v-if="report?.data.pulses.collections"
      >
        <InsightsStatsCard title="Collectivizations per hour">
          <Chart
            type="bar"
            :height="300"
            class="mb-n6"
            :series="report?.data.pulses.collections.series"
            name="autocollects-per-hour"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-card>
      <v-card-text>
        You have no data for this {{ strings.singular }}. Please check back
        later.
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
      reports: [] as Insight[],
      id: null as number | null
    };
  },
  computed: {
    requiredString() {
      if (this.$route.params.username) return `/${this.$route.params.username}`;
      return "";
    },
    items() {
      return this.reports
        .filter((r) => r.type === this.type)
        .map((report) => {
          return {
            ...report,
            name: `${this.$date(report.startDate).format(
              "DD/MM/YYYY"
            )} - ${this.$date(report.endDate).format("DD/MM/YYYY")}`
          };
        });
    },
    type() {
      return this.$route.params.type as string;
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
        // sort by key by getting in between (X), like key = Monday (1)
        object = Object.keys(object)
          .sort((a, b) => {
            const aKey = a.split("(")[1]?.split(")")[0];
            const bKey = b.split("(")[1]?.split(")")[0];
            return parseInt(aKey || "1") - parseInt(bKey || "1");
          })
          .reduce((obj: any, key: string) => {
            obj[key] = object[key];
            return obj;
          }, {});
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
        .get(
          this.$route.params.username
            ? `/pulse/insights/v2/reports/${this.$route.params.username}`
            : `/pulse/insights/v2/reports`
        )
        .then((res) => {
          this.reports = res.data;
        });
    },
    getReport() {
      this.$app.componentLoading = true;
      const id = this.id || this.$route.params.type;
      this.axios
        .get(
          this.$route.params.username
            ? `/pulse/insights/v2/${id}/${this.$route.params.username}`
            : `/pulse/insights/v2/${id}`
        )
        .then((res) => {
          this.report = res.data;
          this.id = res.data.id;
          this.$app.componentLoading = false;
        })
        .catch(() => {
          this.$app.componentLoading = false;
        });
    }
  },
  mounted() {
    this.id = parseInt(<string>this.$route.params.id);
    this.getReport();
    this.getReports();
    this.$app.title = `${
      this.type.charAt(0).toUpperCase() + this.type.slice(1)
    } Insights`;
  },
  watch: {
    type(val) {
      if (!val) return;
      // find the latest in this.reports
      this.id = null;
      this.getReport();
      this.$app.title = `${
        this.type.charAt(0).toUpperCase() + this.type.slice(1)
      } Insights`;
    }
  }
});
</script>

<style scoped></style>
