<template>
  <v-row>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Collections"
        :value="$app.site.stats.collections"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Collectivized"
        :value="$app.site.stats.collectionItems"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="TPU hours"
        :value="$app.site.stats.pulse + 'h'"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard title="Users" :value="$app.site.stats.users"></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard title="Uploads" :value="$app.site.stats.uploads"></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Usage"
        :value="$functions.fileSize($app.site.stats.usage)"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard title="Pulses" :value="$app.site.stats.pulses"></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Invited Users"
        :value="$app.site.stats.invites"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" sm="12" :xl="xl">
      <StatsCard
        title="Workspace Docs"
        :value="$app.site.stats.docs"
      ></StatsCard>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import StatsCard from "@/components/Dashboard/StatsCard.vue";

export default {
  name: "StatsWidget",
  components: { StatsCard },
  data() {
    return {
      cols: 12,
      xl: 4,
      lg: 6,
      md: 4,
      sm: 4
    };
  }
};
</script>

<style scoped></style>
