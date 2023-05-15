<template>
  <v-app>
    <v-overlay :model-value="$app.loading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-overlay
      :model-value="$app.componentLoading"
      class="align-center justify-center"
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <default-bar v-if="$app.site.finishedSetup" />
    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from "./AppBar.vue";
import DefaultView from "./View.vue";
import Sidebar from "@/layouts/default/Sidebar.vue";
</script>
