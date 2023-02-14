<template>
  <v-app v-if="$user.user">
    <v-overlay
      persistent
      absolute
      :model-value="$app.loading"
      class="align-center justify-center"
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-overlay
      persistent
      :model-value="$app.componentLoading"
      class="align-center justify-center"
      absolute
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <default-bar />
    <sidebar></sidebar>
    <workspaces-sidebar></workspaces-sidebar>
    <default-view />
    <template v-if="$experiments.experiments.FAB">
      <v-btn
        variant="flat"
        icon
        position="sticky"
        class="fab"
        color="primary"
        style="color: #151515 !important"
        @click="fab = !fab"
      >
        <v-icon> {{ fab ? "mdi-close" : "mdi-plus" }} </v-icon>
      </v-btn>
      <v-fab-transition>
        <v-btn
          v-if="fab"
          variant="flat"
          icon
          position="sticky"
          class="fab-2"
          color="indigo"
          @click="fab = !fab"
        >
          <v-icon> mdi-upload </v-icon>
        </v-btn>
      </v-fab-transition>
      <v-fab-transition>
        <v-btn
          v-if="fab"
          variant="flat"
          icon
          position="absolute"
          class="fab-3"
          color="success"
          @click="fab = !fab"
        >
          <v-icon> mdi-file-document-plus </v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
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

<script lang="ts">
export default {
  name: "TPUDefaultLayout",
  data() {
    return {
      fab: false
    };
  }
};
</script>

<style scoped>
.fab {
  bottom: 16px;
  right: 16px;
  z-index: 6969;
}
.fab-2 {
  bottom: 76px;
  right: 16px;
  z-index: 6969;
}
.fab-3 {
  bottom: 136px;
  right: 16px;
  z-index: 6969;
}
.fab-4 {
  bottom: 196px;
  right: 16px;
  z-index: 6969;
}
</style>
