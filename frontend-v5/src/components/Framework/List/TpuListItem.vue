<template>
  <li
    v-wave="!$attrs.onClick ? false : null"
    tabindex="0"
    class="text-ellipsis overflow-hidden pl-2"
    :class="{
      'bg-card-secondary-dark': selected,
      'cursor-pointer select-none': $attrs.onClick
    }"
  >
    <div class="my-2 mx-2">
      <slot />
    </div>
  </li>
</template>

<script setup lang="ts">
defineProps({
  selected: Boolean
});
</script>

<style scoped></style>
