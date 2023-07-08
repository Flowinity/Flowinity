<template>
  <v-navigation-drawer
    v-model="val"
    color="dark"
    floating
    permanent
    rail
    style="top: 0; height: 100%; z-index: 2001"
  >
    <v-list
      v-model="$app.railMode"
      aria-label="TPU app selection sidebar"
      class="mt-2"
      density="compact"
      nav
    >
      <v-list-item
        :active="$app.railMode === 'tpu'"
        aria-label="TPU (Main)"
        prepend-icon="mdi-home"
        title="TPU"
        value="tpu"
        @click="$app.railMode = 'tpu'"
      ></v-list-item>
      <v-list-item
        :active="$app.railMode === 'workspaces'"
        aria-label="Workspaces"
        prepend-icon="mdi-folder-account"
        title="Workspaces"
        value="workspaces"
        @click="$app.railMode = 'workspaces'"
      ></v-list-item>
      <v-list-item
        :active="$app.railMode === 'communications'"
        aria-label="Communications"
        prepend-icon="mdi-message-processing"
        title="Communications"
        value="communications"
        @click="$app.railMode = 'communications'"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "RailBar",
  computed: {
    val: {
      get: function () {
        if (!this.$vuetify.display.mobile) return true;
        return this.$app.mainDrawer;
      },
      set: function (value: boolean) {
        if (!this.$vuetify.display.mobile) return;
        this.$app.mainDrawer = value;
      }
    }
  }
});
</script>

<style scoped></style>
