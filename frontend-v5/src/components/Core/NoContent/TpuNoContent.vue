<template>
  <div
    class="flex flex-col items-center justify-center text-medium-emphasis-dark fill-medium-emphasis-dark select-none"
  >
    <div style="width: 96px">
      <slot name="icon" />
    </div>
    <strong class="text-xl">
      <slot name="title" />
    </strong>
    <p class="text-sm"><slot name="description" /></p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
