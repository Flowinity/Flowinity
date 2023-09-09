<template>
  <div class="player" :style="{ left: x + 'px', top: y + 'px' }"></div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "KollisionPlayer",
  props: {
    x: Number,
    y: Number
  }
});
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
