<script setup lang="ts">
defineProps({
  drawer: Boolean,
  width: {
    type: String,
    default: "256px"
  }
});
</script>

<template>
  <aside
    class="transition-width border-l-2 sticky z-50 dark:border-outline-dark dark:bg-sidebar-dark border-dark flex flex-col overflow-y-auto overflow-x-hidden"
    :style="{ minWidth: width, width: width }"
    :class="{ 'h-screen': !drawer, 'h-[calc(100vh-64px)]': drawer }"
  >
    <slot />
  </aside>
</template>

<style scoped>
.transition-width {
  transition:
    min-width 0.15s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
