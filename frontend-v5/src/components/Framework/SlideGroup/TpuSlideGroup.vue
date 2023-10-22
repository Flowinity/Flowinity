<template>
  <div
    class="flex items-center overflow-x-hidden relative w-full whitespace-nowrap"
  >
    <div class="h-full bg-card-dark z-10 rounded-none">
      <tpu-button variant="passive" @click="scrollX += 100" v-if="scrollX < 0">
        <RiArrowLeftSLine style="width: 20px" />
      </tpu-button>
    </div>

    <div class="flex carousel-inner flex-1 z-0" style="contain: content">
      <div class="flex" v-bind="$attrs" ref="carousel">
        <slot />
      </div>
    </div>
    <tpu-button
      variant="passive"
      class="h-full absolute right-0 rounded-none bg-card-dark z-10"
      @click="scrollX -= 100"
      v-if="!disabled"
    >
      <RiArrowRightSLine style="width: 20px" />
    </tpu-button>
  </div>
</template>

<script setup lang="ts">
import RiArrowLeftSLine from "vue-remix-icons/icons/ri-arrow-left-s-line.vue";
import RiArrowRightSLine from "vue-remix-icons/icons/ri-arrow-right-s-line.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { computed, ref } from "vue";
const scrollX = ref(0);
const carousel = ref<HTMLElement | null>(null);
const disabled = computed(() => {
  if (!carousel.value) return false;
  return carousel.value?.offsetWidth - 300 <= Math.abs(scrollX.value);
});
const scrollXpx = computed(() => {
  return scrollX.value + "px";
});
</script>

<style scoped>
.carousel-inner {
  transition: transform 0.3s;
  transform: translateX(v-bind(scrollXpx));
}
</style>
