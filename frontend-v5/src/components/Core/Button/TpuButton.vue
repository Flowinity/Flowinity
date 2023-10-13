<script setup lang="ts">
const props = defineProps({
  icon: Boolean
});
</script>

<template>
  <div class="rounded-full p-2 outline dark:outline-outline-dark" v-wave>
    <slot />
  </div>
</template>
