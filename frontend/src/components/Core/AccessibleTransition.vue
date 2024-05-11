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

<script lang="ts" setup></script>

<style scoped></style>
