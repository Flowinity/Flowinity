<template>
  <v-row>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        :title="$t('stats.collections')"
        :user="true"
        :value="$app.site.stats.collections?.toLocaleString()"
      />
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        :title="$t('stats.collectivized')"
        :user="true"
        :value="$app.site.stats.collectionItems?.toLocaleString()"
      />
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        :title="$t('stats.hours')"
        :user="true"
        :value="$app.site.stats.pulse?.toLocaleString() + 'h'"
      />
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        :title="$t('stats.users')"
        :user="true"
        :value="$app.site.stats.users?.toLocaleString()"
      />
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        :title="$t('stats.uploads')"
        :user="true"
        :value="$app.site.stats.uploads?.toLocaleString()"
      />
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        :title="$t('stats.usage')"
        :user="true"
        :value="$functions.fileSize($app.site.stats.usage)"
      />
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        :title="$t('stats.pulses')"
        :user="true"
        :value="$app.site.stats.pulses?.toLocaleString()"
      />
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        :title="$t('stats.invited')"
        :user="true"
        :value="$app.site.stats.invites?.toLocaleString()"
      />
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="xl">
      <StatsCard
        :title="$t('stats.documents')"
        :user="true"
        :value="$app.site.stats.docs?.toLocaleString()"
      />
    </v-col>
    <v-col :cols="cols" :lg="lg" :md="md" :sm="sm" :xl="6">
      <StatsCard
        :title="$t('stats.messages')"
        :user="true"
        :value="$app.site.stats.messages?.toLocaleString()"
      />
    </v-col>
    <v-col :cols="cols" :lg="12" :md="md" :sm="sm" :xl="6">
      <StatsCard
        :title="$t('stats.chats')"
        :user="true"
        :value="$app.site.stats.chats?.toLocaleString()"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import StatsCard from "@/components/Dashboard/StatsCard.vue";
import { defineComponent } from "vue";

export default defineComponent({
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
      default: 12
    },
    sm: {
      type: Number,
      default: 12
    }
  }
});
</script>
