<template>
  <transition
    v-if="!$experiments.experiments.DISABLE_ANIMATIONS"
    v-bind="$props"
  >
    <slot />
  </transition>
  <template v-else>
    <slot />
  </template>
</template>

<script lang="ts" setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    default: "in-out"
  }
});
</script>

<style scoped></style>
