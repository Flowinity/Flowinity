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
          <strong
            style="font-size: 24px"
            :class="{
              'text-gradient-custom text-gradient': !user,
              'text-gradient': user
            }"
          >
            Upload Stats
          </strong>
          <div class="mx-1">
            <Chart
              id="global-uploads"
              :data="uploadGraph || $app.site.stats.uploadGraph"
              v-if="uploadGraph || $app.site.stats.uploadGraph"
              type="line"
              name="Uploads"
              :height="height"
              :color="primaryColorResult.primary"
            ></Chart>
          </div>
        </v-window-item>
        <v-window-item value="messages">
          <strong
            style="font-size: 24px"
            :class="{
              'text-gradient-custom text-gradient': !user,
              'text-gradient': user
            }"
          >
            Message Stats
          </strong>
          <div class="mx-1">
            <Chart
              id="global-messages"
              :data="messageGraph || $app.site.stats.messageGraph"
              v-if="messageGraph || $app.site.stats.messageGraph"
              type="line"
              name="Messages"
              :height="height"
              :color="primaryColorResult.primary"
            ></Chart>
          </div>
        </v-window-item>
        <v-window-item value="hours">
          <strong
            style="font-size: 24px"
            :class="{
              'text-gradient-custom text-gradient': !user,
              'text-gradient': user
            }"
          >
            Time spent on TPU
          </strong>
          <div class="mx-1">
            <Chart
              id="global-hours"
              :data="pulseGraph || $app.site.stats.pulseGraph"
              v-if="pulseGraph || $app.site.stats.pulseGraph"
              type="line"
              name="Hours"
              :height="height"
              :color="primaryColorResult.primary"
            ></Chart>
          </div>
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
    },
    gold: {
      type: Boolean,
      default: false
    },
    primaryColor: {
      type: String
    },
    user: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    primaryColorResult() {
      return this.$user.primaryColorResult(
        this.primaryColor || this.$user.theme.colors.primary,
        this.gold
      );
    }
  }
});
</script>

<style scoped>
.text-gradient-custom {
  background: -webkit-linear-gradient(
    v-bind("primaryColorResult.gradient1"),
    v-bind("primaryColorResult.gradient2")
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
