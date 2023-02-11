<template>
  <v-card class="text-center justify-center">
    <v-container>
      <strong style="font-size: 24px" class="text-gradient">{{ title }}</strong>
      <p style="font-size: 48px">
        {{ value }}
      </p>
    </v-container>
  </v-card>
</template>

<script lang="ts">
export default {
  name: "StatsCard",
  props: ["title", "value"]
}
</script>

<style scoped></style>
