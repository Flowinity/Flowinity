<template>
  <v-row>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Collections"
        :value="$app.site.stats.collections?.toLocaleString()"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Collectivized"
        :value="$app.site.stats.collectionItems?.toLocaleString()"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="TPU Hours"
        :value="$app.site.stats.pulse?.toLocaleString() + 'h'"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Users"
        :value="$app.site.stats.users?.toLocaleString()"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Uploads"
        :value="$app.site.stats.uploads?.toLocaleString()"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Usage"
        :value="$functions.fileSize($app.site.stats.usage)"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Pulses"
        :value="$app.site.stats.pulses?.toLocaleString()"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Invited Users"
        :value="$app.site.stats.invites?.toLocaleString()"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Documents"
        :value="$app.site.stats.docs?.toLocaleString()"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Messages"
        :value="$app.site.stats.messages?.toLocaleString()"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Chats"
        :value="$app.site.stats.chats?.toLocaleString()"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Crashes"
        :value="$app.site.stats.crashes?.toLocaleString()"
      ></StatsCard>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import StatsCard from "@/components/Dashboard/StatsCard.vue";

export default {
  name: "StatsWidget",
  components: { StatsCard },
  props: {
    cols: {
      type: Number,
      default: 12
    },
    xl: {
      type: Number,
      default: 4
    },
    lg: {
      type: Number,
      default: 6
    },
    md: {
      type: Number,
      default: 4
    },
    sm: {
      type: Number,
      default: 4
    }
  }
};
</script>

<style scoped></style>
