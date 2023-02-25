<template>
  <v-card class="text-center justify-center" height="500">
    <v-container>
      <strong style="font-size: 24px" class="text-gradient">
        Upload Stats
      </strong>
      <Chart
        id="global-uploads"
        :data="$app.site.stats.uploadGraph"
        v-if="$app.site.stats.uploadGraph"
        type="line"
        name="Uploads"
        :height="420"
      ></Chart>
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
  components: { Chart, UserBadges, UserAvatar }
});
</script>

<style scoped></style>
