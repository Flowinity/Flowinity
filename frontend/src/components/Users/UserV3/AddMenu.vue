<template>
  <v-btn class="float-right mb-2">
    <v-menu activator="parent" location="bottom">
      <template v-slot:activator>
        <v-icon class="mr-1">mdi-plus</v-icon>
        Add widget
      </template>
      <v-list max-height="300">
        <div v-for="comp in components">
          <v-tooltip
            v-if="comp.disabled"
            :eager="false"
            activator="parent"
            location="top"
          >
            Link your account in Settings > Integrations.
          </v-tooltip>
          <v-list-item
            :key="comp.id"
            :disabled="comp.disabled"
            @click="$emit('add', comp.id)"
          >
            <v-list-item-title>{{ comp.name }}</v-list-item-title>
          </v-list-item>
        </div>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserV3AddMenu",
  props: ["components"],
  emits: ["add"]
});
</script>

<style scoped></style>
