<template>
  <div
    v-if="modelValue"
    class="absolute top-0 left-0 z-30 w-screen h-screen bg-black opacity-50"
    @click="$emit('update:modelValue', false)"
  ></div>
  <div
    id="drawer-navigation"
    ref="drawer"
    class="fixed top-[64px] h-[calc(100vh-64px)] left-0 z-40 transition-transform dark:bg-gray-800"
    :class="{ '-translate-x-full': !modelValue, 'translate-x-0': modelValue }"
    v-bind="$attrs"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean
  }
});

const drawer = ref<HTMLElement | null>(null);

const emit = defineEmits(["update:modelValue"]);

let touchStartX = 0;
let touchCurrentX = 0;

const closeDrawer = () => {
  if (props.modelValue) {
    emit("update:modelValue", false);
  }
};

const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX;
  touchCurrentX = touchStartX;
};

const onTouchMove = (e: TouchEvent) => {
  if (touchStartX !== null) {
    touchCurrentX = e.touches[0].clientX;
    const deltaX = touchCurrentX - touchStartX;
    if (deltaX < -150) {
      // Swiping to the left (close the drawer)
      closeDrawer();
    }
  }
};
</script>

<style scoped></style>
