<template>
  <v-card class="text-center justify-center">
    <v-container>
      <strong
        style="font-size: 24px"
        :class="{ 'text-gradient': !gold, 'gold-text-gradient': gold }"
      >
        {{ title }}
      </strong>
      <p style="font-size: 36px">
        {{ value }}
      </p>
    </v-container>
  </v-card>
</template>

<script lang="ts">
export default {
  name: "StatsCard",
  props: ["title", "value", "gold"]
};
</script>

<style scoped></style>
