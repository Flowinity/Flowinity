<script setup lang="ts">
const props = defineProps({
  secondary: Boolean,
  outlined: Boolean
});
</script>

<template>
  <div
    :class="{
      'dark:bg-card-dark': !props.secondary && !outlined,
      'dark:bg-card-secondary-dark': props.secondary && !outlined,
      'outline dark:outline-outline-dark': outlined
    }"
    class="rounded-xl p-4"
  >
    <strong v-if="$slots.header">
      <slot name="header" />
    </strong>
    <slot />
  </div>
</template>

<style scoped></style>
