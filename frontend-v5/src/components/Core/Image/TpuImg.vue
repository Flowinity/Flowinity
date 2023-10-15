<template>
  <div class="relative w-full">
    <div
      class="w-full flex items-center justify-center fill-medium-emphasis-dark text-medium-emphasis-dark"
      v-if="loading || errored"
      :style="{ height: height + 'px' }"
    >
      <tpu-spinner v-if="!errored" />
      <RiLinkUnlinkM :style="{ width: height + 'px' }" v-else />
    </div>
    <img
      v-else
      :src="src"
      :class="[cover ? 'object-cover' : 'object-contain']"
      :style="{
        backgroundImage: gradient,
        height: height + 'px',
        minHeight: height + 'px',
        maxHeight: height + 'px'
      }"
      alt="Image"
      @load="onImageLoad"
      @error="onImageError"
    />
    <slot />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TpuSpinner from "@/components/Core/Spinner/TpuSpinner.vue";
import RiLinkUnlinkM from "vue-remix-icons/icons/ri-link-unlink-m.vue";

const loading = ref(true);
const errored = ref(false);

const onImageLoad = () => {
  loading.value = false;
};

const onImageError = () => {
  errored.value = true;
  loading.value = false;
};

const props = defineProps({
  cover: Boolean,
  src: String,
  size: String,
  gradient: String,
  height: [String, Number],
  width: [String, Number]
});

onMounted(() => {
  const image = new Image();
  image.src = props.src;
  image.onload = () => {
    loading.value = false;
  };
  image.onerror = () => {
    errored.value = true;
    loading.value = false;
  };
});
</script>
