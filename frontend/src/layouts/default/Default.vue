<template>
  <v-app v-if="$user.user">
    <v-overlay :model-value="$app.loading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-overlay
      :model-value="$app.componentLoading"
      class="align-center justify-center"
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <default-bar />
    <sidebar></sidebar>
    <workspaces-sidebar></workspaces-sidebar>
    <default-view />
  </v-app>
  <v-app v-else>
    <v-overlay :model-value="$app.loading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-overlay
      :model-value="$app.componentLoading"
      class="align-center justify-center"
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <unauth-bar></unauth-bar>
    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from "./AppBar.vue";
import DefaultView from "./View.vue";
import Sidebar from "@/layouts/default/Sidebar.vue";
import UnauthBar from "@/layouts/unauth/AppBar.vue";
import WorkspacesSidebar from "@/layouts/default/WorkspacesSidebar.vue";
</script>
