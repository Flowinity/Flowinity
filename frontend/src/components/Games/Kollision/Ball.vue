<template>
  <div class="ball" :style="{ left: x + 'px', top: y + 'px' }"></div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "KollisionBall",
  props: {
    x: Number,
    y: Number
  }
});
</script>

<style scoped>
.ball {
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: rgb(var(--v-theme-error));
  border-radius: 50%;
}
</style>
