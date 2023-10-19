<template>
  <div
    :class="{ gradient: props.gradient }"
    class="relative w-full select-none"
  >
    <div
      class="w-full h-full flex items-center justify-center stroke-medium-emphasis-dark absolute"
      v-if="loading || errored"
      :style="{ height: height + 'px' }"
    >
      <tpu-spinner v-if="!errored" color="text-medium-emphasis-dark" />
      <RiLinkUnlinkM :style="{ width: height + 'px' }" v-else />
    </div>
    <img
      :src="src"
      :class="[cover ? 'object-cover' : 'object-contain', imageClasses]"
      :style="{
        height: dimensions.height,
        maxHeight: dimensions.height,
        width: dimensions.width,
        maxWidth: dimensions.width
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
import { isNumeric } from "@/plugins/isNumeric";

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
  width: [String, Number],
  imageClasses: String
});

const dimensions = computed(() => {
  return {
    height: isNumeric(props.height)
      ? props.height + "px"
      : props.height || "100%",
    width: isNumeric(props.width) ? props.width + "px" : props.width || "100%"
  };
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

<style scoped>
.gradient:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.9)
  );
  border-radius: 12px;
}
.gradient {
  border-radius: 12px;
}
</style>
