<template>
  <v-navigation-drawer
    v-model="$app.mainDrawer"
    floating
    permanent
    rail
    style="top: 0 !important"
    color="dark"
  >
    <v-list
      density="compact"
      nav
      class="mt-2"
      v-model="$app.railMode"
      aria-label="TPU app selection sidebar"
    >
      <v-list-item
        aria-label="TPU (Main)"
        title="TPU"
        value="tpu"
        :active="$app.railMode === 'tpu'"
        @click="$app.railMode = 'tpu'"
        prepend-icon="mdi-home"
      ></v-list-item>
      <v-list-item
        aria-label="Workspaces"
        prepend-icon="mdi-folder-account"
        title="Workspaces"
        value="workspaces"
        :active="$app.railMode === 'workspaces'"
        @click="$app.railMode = 'workspaces'"
      ></v-list-item>
      <v-list-item
        aria-label="Communications"
        prepend-icon="mdi-message-processing"
        title="Communications"
        value="communications"
        :active="$app.railMode === 'communications'"
        @click="$app.railMode = 'communications'"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RailBar"
});
</script>

<style scoped></style>
