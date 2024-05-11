<template>
  <v-container v-if="$user.user">
    <v-row>
      <v-col md="6">
        <ContinueLastContext />
      </v-col>
      <v-col md="6">
        <StatsWidget />
        <GraphWidget :gold="$user.gold" :user="true" class="mt-6" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import ContinueLastContext from "@/components/Dashboard/Progressive/ContinueLastContext.vue";
</script>
