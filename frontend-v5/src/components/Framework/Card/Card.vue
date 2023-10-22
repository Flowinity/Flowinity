<script setup lang="ts">
const props = defineProps({
  secondary: Boolean,
  outlined: Boolean,
  padding: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <div
    :class="{
      'dark:bg-card-dark': !props.secondary && !outlined,
      'dark:bg-card-secondary-dark': props.secondary && !outlined,
      'outline dark:outline-outline-dark': outlined,
      'p-4': padding
    }"
    class="rounded-xl"
  >
    <strong v-if="$slots.header">
      <slot name="header" />
    </strong>
    <slot />
  </div>
</template>

<style scoped></style>
