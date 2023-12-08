<template>
  <div
    class="three-panel-layout w-full"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div
      class="panel left-panel flex"
      @click="openLeftPanel"
      :style="{
        transform: `translateX(calc(-100% + ${leftOffset}px))`
      }"
    >
      <super-bar />
      <side-bar />
    </div>
    <div class="panel center-panel" ref="centerPanel">
      <app-bar />
      <router-view />
    </div>
    <div
      class="panel right-panel"
      @click="openRightPanel"
      :style="{
        transform: `translateX(calc(100% - ${rightOffset}px))`
      }"
    >
      Right Panel
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppBar from "@/layouts/default/AppBar.vue";
import SideBar from "@/layouts/default/SideBar.vue";
import SuperBar from "@/layouts/default/SuperBar.vue";

let touchStartX: number | null = null;
let touchEndX: number | null = null;
const leftOffset = ref(0);
const rightOffset = ref(0);
const centerPanel = ref<HTMLElement | null>(null);

function handleTouchStart(event: TouchEvent) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchMove(event: TouchEvent) {
  if (!touchStartX) return;

  touchEndX = event.touches[0].clientX;

  const swipeDistance = touchEndX - touchStartX;

  if (swipeDistance > 0) {
    leftOffset.value = swipeDistance;
  } else {
    if (leftOffset.value > 0) {
      leftOffset.value = -swipeDistance;
      return;
    }
    rightOffset.value = Math.abs(swipeDistance);
  }
}

function handleTouchEnd() {
  touchStartX = null;
  touchEndX = null;

  const centerPanelWidth = (centerPanel.value as HTMLElement).offsetWidth;

  if (leftOffset.value > centerPanelWidth / 2) {
    leftOffset.value = centerPanelWidth;
    rightOffset.value = 0;
  } else if (rightOffset.value > centerPanelWidth / 2) {
    rightOffset.value = centerPanelWidth;
    leftOffset.value = 0;
  } else {
    leftOffset.value = 0;
    rightOffset.value = 0;
  }
}

function openLeftPanel() {
  leftOffset.value = 0;
  rightOffset.value = 0;
}

function openRightPanel() {
  leftOffset.value = 0;
  rightOffset.value = 0;
}
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
