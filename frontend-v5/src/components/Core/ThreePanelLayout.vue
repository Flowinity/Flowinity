<template>
  <div class="three-panel-layout w-full" v-bind="bind()" :style="style">
    <div
      class="panel left-panel flex"
      @click="leftOffset = 0"
      :style="{
        transform: `translateX(calc(-100% + ${leftOffset}px))`
      }"
    >
      <super-bar />
      <side-bar />
    </div>
    <div class="panel center-panel" ref="centerPanel">
      <app-bar />
      {{ style }}
      <router-view />
    </div>
    <div
      class="panel right-panel"
      @click="rightOffset = 0"
      :style="{
        transform: `translateX(calc(100% - ${rightOffset}px))`
      }"
    >
      right
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useDrag, useGesture, useMove, useSpring } from "vue-use-gesture";
import AppBar from "@/layouts/default/AppBar.vue";
import SuperBar from "@/layouts/default/SuperBar.vue";
import SideBar from "@/layouts/default/SideBar.vue";

const centerPanel = ref<HTMLElement | null>(null);
const rightOffset = ref(0);
const leftOffset = ref(0);

function handleSwipe(
  direction: "left" | "right",
  { deltaX }: { deltaX: number }
) {
  console.log("Yes");
  const distance = Math.abs(deltaX);
  const centerPanelWidth = (centerPanel.value as HTMLElement).offsetWidth;

  if (direction === "left") {
    rightOffset.value = 0;
    leftOffset.value = Math.min(distance, centerPanelWidth);
  } else if (direction === "right") {
    leftOffset.value = 0;
    rightOffset.value = Math.min(distance, centerPanelWidth);
  }
}

const [{ x }, set] = useSpring(() => ({ x: 0 }));
const bind = useDrag(
  ({ down, movement: [mx] }) =>
    set({ x: down ? mx : 0, immediate: down, config: { duration: 3000 } }),
  { initial: () => [x.value, 0] }
);
const style = computed(() => ({ transform: `translate3d(${x.value}px,0,0)` }));

onMounted(() => {
  console.log(centerPanel);
});

onUnmounted(() => {
  leftOffset.value = 0;
  rightOffset.value = 0;
});
</script>

<style>
.three-panel-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.panel {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  transition: transform 0.3s ease-in-out;
  box-sizing: border-box;
}

.left-panel {
  z-index: 2;
}

.center-panel {
  z-index: 1;
}

.right-panel {
  z-index: 3;
}
</style>
