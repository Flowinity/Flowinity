<template>
  <card
    class="text-white flex-col text-center"
    :secondary="true"
    style="max-width: 400px"
    padding
  >
    <p class="text-xl">Meet the Action Bar!</p>
    <p>
      The Action Bar adapts dynamically depending on what page you visit and
      contains the main actions associated with the page.
    </p>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
</script>

<style scoped></style>
