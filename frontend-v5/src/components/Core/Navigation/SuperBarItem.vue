<script setup lang="ts">
const props = defineProps({
  selected: Boolean,
  highlighted: Boolean
});
</script>

<template>
  <div
    class="rounded-2xl hover:bg-outline-dark cursor-pointer p-2"
    :class="{
      'bg-outline-dark': props.selected || props.highlighted,
      'rounded-full': props.highlighted
    }"
    v-wave
  >
    <slot />
  </div>
</template>

<style scoped></style>
