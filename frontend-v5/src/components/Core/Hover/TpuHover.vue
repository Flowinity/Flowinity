<template>
  <div @mouseenter="hovering = true" @mouseleave="hovering = false">
    <slot :hovering="hovering"></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const hovering = ref(false);
</script>
