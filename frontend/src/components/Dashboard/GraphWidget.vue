<template>
  <v-card class="text-center justify-center" :height="cardHeight">
    <v-container>
      <v-tabs v-model="tab" align-tabs="center" class="mb-3 mt-n3">
        <v-tab value="uploads">Uploads</v-tab>
        <v-tab value="messages">Messages</v-tab>
        <v-tab value="hours">Hours</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item value="uploads">
          <strong style="font-size: 24px" class="text-gradient">
            Upload Stats
          </strong>
          <Chart
            id="global-uploads"
            :data="uploadGraph || $app.site.stats.uploadGraph"
            v-if="uploadGraph || $app.site.stats.uploadGraph"
            type="line"
            name="Uploads"
            :height="height"
          ></Chart>
        </v-window-item>
        <v-window-item value="messages">
          <strong style="font-size: 24px" class="text-gradient">
            Message Stats
          </strong>
          <Chart
            id="global-messages"
            :data="messageGraph || $app.site.stats.messageGraph"
            v-if="messageGraph || $app.site.stats.messageGraph"
            type="line"
            name="Messages"
            :height="height"
          ></Chart>
        </v-window-item>
        <v-window-item value="hours">
          <strong style="font-size: 24px" class="text-gradient">
            Time spent on TPU
          </strong>
          <Chart
            id="global-hours"
            :data="pulseGraph || $app.site.stats.pulseGraph"
            v-if="pulseGraph || $app.site.stats.pulseGraph"
            type="line"
            name="Hours"
            :height="height"
          ></Chart>
        </v-window-item>
      </v-window>
    </v-container>
    <v-card-subtitle class="text-left mt-n8">
      <small>Cache: {{ $date($app.site._redis).fromNow() }}</small>
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import UserAvatar from "@/components/Users/UserAvatar.vue";
import UserBadges from "@/components/Users/UserBadges.vue";
import { defineComponent } from "vue";
import Chart from "@/components/Core/Chart.vue";

export default defineComponent({
  name: "GraphWidget",
  components: { Chart, UserBadges, UserAvatar },
  data() {
    return {
      tab: "uploads"
    };
  },
  props: {
    uploadGraph: {
      type: Object
    },
    messageGraph: {
      type: Object
    },
    pulseGraph: {
      type: Object
    },
    height: {
      type: Number,
      default: 420
    },
    cardHeight: {
      type: Number,
      default: 555
    }
  }
});
</script>

<style scoped></style>
