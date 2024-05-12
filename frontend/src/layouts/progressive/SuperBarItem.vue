<script setup lang="ts">
const props = defineProps({
  selected: Boolean,
  highlighted: Boolean,
  badge: [Number, String]
});
</script>

<template>
  <div
    v-ripple
    class="rounded-full hover:bg-outline-dark cursor-pointer p-2 relative flex items-center justify-center super-bar-item"
    :class="{
      'bg-outline-dark': props.selected || props.highlighted
    }"
    style="width: 40px; height: 40px"
    tabindex="0"
    @keydown.enter="
      //@ts-ignore
      $event.target?.click()
    "
    @keydown.space="
      $event.preventDefault();
      //@ts-ignore
      $event.target?.click();
    "
  >
    <div class="blue-line bg-blue" :class="{ active: props.selected }"></div>
    <v-badge v-if="props.badge" class="absolute -top-1 -right-1" color="red">
      {{ props.badge }}
    </v-badge>
    <slot />
  </div>
</template>
