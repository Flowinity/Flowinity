<template>
  <li
    v-wave
    tabindex="0"
    class="text-ellipsis overflow-hidden pl-2 cursor-pointer"
    :class="{
      'bg-card-secondary-dark': selected
    }"
  >
    <div class="my-2 mx-2">
      <slot />
    </div>
  </li>
</template>

<script setup lang="ts">
const props = defineProps({
  selected: Boolean
});
</script>

<style scoped></style>
