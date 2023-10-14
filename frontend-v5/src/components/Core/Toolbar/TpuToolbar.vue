<template>
  <card :secondary="true" class="rounded-t-xl rounded rounded-b-none">
    <slot />
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Core/Card/Card.vue";
</script>

<style scoped></style>
