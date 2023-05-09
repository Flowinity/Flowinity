<template>
  <v-btn class="float-right mb-2">
    <v-menu location="bottom" activator="parent">
      <template v-slot:activator>
        <v-icon class="mr-1">mdi-plus</v-icon>
        Add widget
      </template>
      <v-list max-height="300">
        <div v-for="comp in components">
          <v-tooltip
            :eager="false"
            activator="parent"
            location="top"
            v-if="comp.disabled"
          >
            Link your account in Settings > Integrations.
          </v-tooltip>
          <v-list-item
            :disabled="comp.disabled"
            :key="comp.id"
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
