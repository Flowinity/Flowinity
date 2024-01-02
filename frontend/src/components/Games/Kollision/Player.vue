<template>
  <div class="player" :style="{ left: x + 'px', top: y + 'px' }"></div>
</template>

<script lang="ts" setup>
defineProps({ x: Number, y: Number });
</script>

<style scoped>
.player {
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: rgb(var(--v-theme-primary));
  border-radius: 50%;
}
</style>
