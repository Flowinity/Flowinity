<template>
  <v-row>
    <v-col cols="4">
      <StatsCard
        title="Collections"
        :value="$app.site.stats.collections"
      ></StatsCard>
    </v-col>
    <v-col cols="4">
      <StatsCard
        title="Collectivized Items"
        :value="$app.site.stats.collectionItems"
      ></StatsCard>
    </v-col>
    <v-col cols="4">
      <StatsCard
        title="TPU hours"
        :value="$app.site.stats.pulse + 'h'"
      ></StatsCard>
    </v-col>
    <v-col cols="4">
      <StatsCard title="Users" :value="$app.site.stats.users"></StatsCard>
    </v-col>
    <v-col cols="4">
      <StatsCard title="Uploads" :value="$app.site.stats.uploads"></StatsCard>
    </v-col>
    <v-col cols="4">
      <StatsCard
        title="Usage"
        :value="$functions.fileSize($app.site.stats.usage)"
      ></StatsCard>
    </v-col>
    <v-col cols="4">
      <StatsCard title="Pulses" :value="$app.site.stats.pulses"></StatsCard>
    </v-col>
    <v-col cols="4">
      <StatsCard
        title="Total Invited Users"
        :value="$app.site.stats.invites"
      ></StatsCard>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import StatsCard from "@/components/Dashboard/StatsCard.vue";

export default {
  name: "StatsWidget",
  components: { StatsCard }
};
</script>

<style scoped></style>
