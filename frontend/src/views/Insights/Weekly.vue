<template>
  <v-container v-if="report" :key="report.id">
    <DynamicCard
      :height="$vuetify.display.mobile ? '150px' : '250px'"
      :image="strings.banner"
      style="cursor: default"
    >
      <v-card-text
        class="unselectable"
        style="position: absolute; bottom: 0; left: 0; font-size: 18px"
      >
        <span :class="{ 'text-black': type === 'weekly' }" style="z-index: 2">
          <v-select
            v-if="type !== 'dynamic'"
            v-model="id"
            :color="type === 'weekly' ? 'black' : 'white'"
            :items="items"
            class="mb-n6"
            item-title="name"
            item-value="id"
            @update:model-value="getReport"
          ></v-select>
        </span>
      </v-card-text>
      <div v-if="!$vuetify.display.mobile" class="float-right mb-3 mr-4">
        <v-btn
          :color="type === 'weekly' ? 'black' : 'white'"
          :to="'/insights/weekly' + requiredString"
          class="mr-2"
        >
          {{ $t("insights.types.weekly") }}
        </v-btn>
        <v-btn
          :color="type === 'weekly' ? 'black' : 'white'"
          :to="'/insights/monthly' + requiredString"
          class="mr-2"
        >
          {{ $t("insights.types.monthly") }}
        </v-btn>
        <v-btn
          :color="type === 'weekly' ? 'black' : 'white'"
          :to="'/insights/yearly' + requiredString"
          class="mr-2"
        >
          {{ $t("insights.types.annually") }}
        </v-btn>
        <v-btn
          :color="type === 'weekly' ? 'black' : 'white'"
          :to="'/insights/dynamic' + requiredString"
        >
          {{ $t("insights.types.dynamic") }}
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
      <v-col cols="12" lg="3" md="4" sm="12" xl="2">
        <InsightsStatsCard
          :count="report?.data.uploads.total?.now"
          :difference="
            report?.data.uploads.total.now - report.data.uploads.total.previous
          "
          :last="report?.data.uploads.total?.previous"
          :title="$t('insights.statsCards.uploads')"
        ></InsightsStatsCard>
        <InsightsStatsCard
          :count="report?.data.messages.total?.now"
          :difference="
            report?.data.messages.total.now -
            report.data.messages.total.previous
          "
          :last="report?.data.messages.total?.previous"
          :title="$t('insights.statsCards.messages')"
          class="mt-4"
        ></InsightsStatsCard>
        <InsightsStatsCard
          v-if="report?.data.uploads.streak.currentStreak"
          :count="report?.data.uploads.streak.currentStreak.length"
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
          :subtitle="`${$date(
            report.data.uploads.streak.currentStreak.startDate
          ).format('DD/MM/YYYY')} - ${$date(
            report.data.uploads.streak.currentStreak.endDate
          ).format('DD/MM/YYYY')}`"
          class="mt-4"
          :title="$t('insights.statsCards.currentStreak')"
        ></InsightsStatsCard>
      </v-col>
      <v-col cols="12" lg="3" md="4" sm="12" xl="2">
        <InsightsStatsCard
          :count="report?.data.uploads.average.now ?? 0"
          :difference="
            report?.data.uploads.average.now -
            report.data.uploads.average.previous
          "
          :last="report?.data.uploads.average.previous ?? 0"
          :title="$t('insights.statsCards.uploadsAvg')"
        ></InsightsStatsCard>
        <InsightsStatsCard
          :count="report?.data.messages.average.now ?? 0"
          :difference="
            report?.data.messages.average.now -
              report.data.messages.average.previous ?? 0
          "
          :last="report?.data.messages.average.previous ?? 0"
          class="mt-4"
          :title="$t('insights.statsCards.messagesAvg')"
        ></InsightsStatsCard>
        <InsightsStatsCard
          v-if="report?.data.uploads.streak.longestStreak"
          :count="report?.data.uploads.streak.longestStreak.length"
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
          :subtitle="`${$date(
            report.data.uploads.streak.longestStreak.startDate
          ).format('DD/MM/YYYY')} - ${$date(
            report.data.uploads.streak.longestStreak.endDate
          ).format('DD/MM/YYYY')}`"
          class="mt-4"
          :title="$t('insights.statsCards.longestStreak')"
        ></InsightsStatsCard>
      </v-col>
      <v-col cols="12" lg="6" md="5" sm="12" xl="4">
        <InsightsStatsCard
          :subtitle="
            $t('insights.statsCards.upload.subtitle', {
              hour: report?.data.uploads.hours.series[0].data.reduce((a, b) =>
                a.y > b.y ? a : b
              ).x
            })
          "
          :title="$t('insights.statsCards.upload.title')"
        >
          <Chart
            :height="300"
            :series="report?.data.uploads.hours.series"
            class="mb-n6"
            type="bar"
            :apex="true"
          ></Chart>
        </InsightsStatsCard>
        <InsightsStatsCard
          class="mt-6"
          :subtitle="$t('insights.statsCards.usage.subtitle')"
          :title="$t('insights.statsCards.usage.title')"
        >
          <Chart
            :data="objectToGraphData(report?.data.pulses.days)"
            :height="300"
            class="mb-n6"
            :name="$t('insights.statsCards.usage.chartTitle')"
            type="bar"
            :apex="true"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col cols="12" lg="6" md="3" sm="12" xl="4">
        <InsightsStatsCard
          :subtitle="
            $t('insights.statsCards.uploadsPerDay.subtitle', {
              day: report?.data.uploads.days.series[0].data.reduce((a, b) =>
                a.y > b.y ? a : b
              ).x
            })
          "
          :title="$t('insights.statsCards.uploadsPerDay.title')"
        >
          <Chart
            :height="300"
            :series="report?.data.uploads.days.series"
            class="mb-n6"
            name="uploads-last-week"
            :title="$t('insights.statsCards.uploadsPerDay.chartTitle')"
            type="bar"
            :apex="true"
          ></Chart>
        </InsightsStatsCard>
        <InsightsStatsCard
          class="mt-6"
          :subtitle="$t('insights.statsCards.platform.subtitle')"
          :title="$t('insights.statsCards.platform.title')"
        >
          <Chart
            :data="objectToGraphData(report?.data.pulses.platforms)"
            :height="300"
            :horizontal="true"
            class="mb-n6"
            :name="$t('insights.statsCards.platform.chartTitle')"
            type="bar"
            :apex="true"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col
        v-if="report.data.uploads.months && type !== 'dynamic'"
        cols="12"
        lg="6"
        md="3"
        sm="12"
        xl="4"
      >
        <InsightsStatsCard
          :title="$t('insights.statsCards.uploadsPerMonth.title')"
          :subtitle="
            $t('insights.statsCards.uploadsPerMonth.subtitle', {
              month: report?.data.uploads.months.series[0].data.reduce((a, b) =>
                a.y > b.y ? a : b
              ).x
            })
          "
        >
          <Chart
            :height="300"
            :series="report?.data.uploads.months.series"
            class="mb-n6"
            name="uploads-last-month"
            type="bar"
            :apex="true"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col
        v-if="report.data.uploads.years"
        cols="12"
        lg="5"
        md="3"
        sm="12"
        xl="4"
      >
        <InsightsStatsCard
          :title="$t('insights.statsCards.uploadsPerYear.title')"
          :subtitle="
            $t('insights.statsCards.uploadsPerYear.subtitle', {
              year: report?.data.uploads.years.series[0].data.reduce((a, b) =>
                a.y > b.y ? a : b
              ).x
            })
          "
        >
          <Chart
            :height="300"
            :series="report?.data.uploads.years.series"
            class="mb-n6"
            name="uploads-last-month"
            type="bar"
            :apex="true"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col
        v-if="report?.data.uploads.words"
        cols="12"
        lg="6"
        md="3"
        sm="12"
        xl="4"
      >
        <InsightsStatsCard
          :title="$t('insights.statsCards.topWords.title')"
          :subtitle="$t('insights.statsCards.topWords.subtitle')"
        >
          <v-data-table
            :headers="headers.words"
            :items="report?.data.uploads.words"
            :items-per-page="4"
            :sort-by="[{ key: 'count', order: 'desc' }]"
            class="text-left"
          >
            <template v-slot:item.word="{ item }">
              <div class="limit" style="max-width: 200px">
                {{ item.word }}
              </div>
            </template>
            <template v-slot:item.count="{ item }">
              <div class="limit">
                {{ item.count }}
              </div>
            </template>
          </v-data-table>
        </InsightsStatsCard>
      </v-col>
      <v-col
        v-if="report?.data.messages.topChats"
        cols="12"
        lg="6"
        md="3"
        sm="12"
        xl="4"
      >
        <InsightsStatsCard
          :title="$t('insights.statsCards.topChats.title')"
          :subtitle="$t('insights.statsCards.topChats.subtitle')"
        >
          <v-data-table
            :headers="headers.topChats"
            :items="report?.data.messages.topChats"
            :items-per-page="4"
            :sort-by="[{ key: 'count', order: 'desc' }]"
            class="text-left"
          >
            <template v-slot:item.word="{ item }">
              <div class="limit" style="max-width: 200px">
                {{ item.chatName }}
              </div>
            </template>
            <template v-slot:item.count="{ item }">
              <div class="limit">
                {{ item.count }}
              </div>
            </template>
          </v-data-table>
        </InsightsStatsCard>
      </v-col>
      <v-col
        v-if="report?.data.pulses.autoCollects"
        cols="12"
        lg="6"
        md="3"
        sm="12"
        xl="4"
      >
        <InsightsStatsCard
          :title="$t('insights.statsCards.autoCollects.title')"
          :subtitle="$t('insights.statsCards.autoCollects.subtitle')"
        >
          <Chart
            :height="300"
            :series="report?.data.pulses.autoCollects.series"
            class="mb-n6"
            name="autocollects-per-hour"
            type="bar"
            :apex="true"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col
        v-if="report?.data.pulses.collections"
        cols="12"
        lg="6"
        md="3"
        sm="12"
        xl="4"
      >
        <InsightsStatsCard
          :title="$t('insights.statsCards.collections.title')"
          :subtitle="$t('insights.statsCards.collections.subtitle')"
        >
          <Chart
            :height="300"
            :series="report?.data.pulses.collections.series"
            class="mb-n6"
            name="autocollects-per-hour"
            type="bar"
            :apex="true"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
      <v-col cols="12" lg="6" md="3" sm="12" xl="4">
        <InsightsStatsCard
          :title="$t('insights.statsCards.features.title')"
          :subtitle="$t('insights.statsCards.features.subtitle')"
        >
          <Chart
            :data="arrayToGraphData(report?.data.pulses.features)"
            :height="300"
            :horizontal="true"
            class="mb-n6"
            name="Hours"
            type="bar"
            :apex="true"
          ></Chart>
        </InsightsStatsCard>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-card>
      <v-card-text v-if="type !== 'dynamic'">
        {{
          $t("insights.noData", {
            type: strings.singular
          })
        }}
      </v-card-text>
      <v-card-text v-else>
        {{ $t("insights.noDataDynamic") }}
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
  name: "InsightsReport",
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
    // todo: replace ApexCharts
    /*  chartJSSeries(data: SeriesGraph) {
      const d = data.series[0];
      let val;
      try {
        val = {
          labels: d.data.map((d) => d.x),
          datasets: [
            {
              data: d.data.map((d) => d.y),
              label: d.name
            },
            {
              data: d.data.map((v) => v.goals.map((g) => g.value)[0]),
              label: `Last ${this.strings.singular}`
            }
          ],
          label: d.name
        };
      } catch (e) {
        val = {
          labels: d.data.map((d) => d.x),
          datasets: [
            {
              data: d.data.map((d) => d.y),
              label: d.name
            }
          ],
          label: d.name
        };
      }
      console.log(val);
      return val;
    },*/
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
