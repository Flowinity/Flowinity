<script setup lang="ts">
const props = defineProps({
  selected: Boolean,
  highlighted: Boolean
});
</script>

<template>
  <div
    class="rounded-2xl hover:bg-outline-dark cursor-pointer p-2 relative"
    :class="{
      'bg-outline-dark': props.selected || props.highlighted,
      'rounded-full': props.highlighted
    }"
    v-wave
    tabindex="0"
    @keydown.enter="$event.target?.click()"
    @keydown.space="
      $event.preventDefault();
      $event.target?.click();
    "
  >
    <div class="blue-line bg-blue" :class="{ active: props.selected }"></div>
    <slot />
  </div>
</template>
