<template>
  <v-row>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Collections"
        :value="$app.site.stats.collections?.toLocaleString()"
        :user="true"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Collectivized"
        :value="$app.site.stats.collectionItems?.toLocaleString()"
        :user="true"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="TPU Hours"
        :value="$app.site.stats.pulse?.toLocaleString() + 'h'"
        :user="true"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Users"
        :value="$app.site.stats.users?.toLocaleString()"
        :user="true"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Uploads"
        :value="$app.site.stats.uploads?.toLocaleString()"
        :user="true"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Usage"
        :value="$functions.fileSize($app.site.stats.usage)"
        :user="true"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Pulses"
        :value="$app.site.stats.pulses?.toLocaleString()"
        :user="true"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Invited Users"
        :value="$app.site.stats.invites?.toLocaleString()"
        :user="true"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        title="Documents"
        :value="$app.site.stats.docs?.toLocaleString()"
        :user="true"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :sm="6">
      <StatsCard
        title="Messages"
        :value="$app.site.stats.messages?.toLocaleString()"
        :user="true"
      ></StatsCard>
    </v-col>
    <v-col :cols="cols" :sm="6" :lg="12" :xl="6">
      <StatsCard
        title="Chats"
        :value="$app.site.stats.chats?.toLocaleString()"
        :user="true"
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
