<template>
  <div
    :class="{ gradient: props.gradient, ...parentClasses }"
    class="relative w-full select-none"
  >
    <div
      v-if="loading || errored"
      class="w-full h-full flex items-center justify-center absolute"
      style="z-index: 1"
      :style="{ height: height + 'px' }"
    >
      <tpu-spinner
        v-if="!errored"
        color="medium-emphasis-dark"
        :size="spinnerSize"
        :inner-width="spinnerInnerWidth"
      />
      <RiLinkUnlinkM
        v-else
        :style="{ width: height || 72 + 'px' }"
        alt="Image error"
      />
    </div>
    <img
      v-if="!errored"
      :src="src"
      :class="[
        cover ? 'object-cover' : 'object-contain',
        { loaded: !loading },
        imageClasses
      ]"
      :style="{
        height: dimensions.height,
        maxHeight: dimensions.height,
        width: dimensions.width,
        maxWidth: dimensions.width
      }"
      alt="Image"
      v-bind="$attrs"
      @load="onImageLoad"
      @error="onImageError"
      draggable="false"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, PropType } from "vue";
import TpuSpinner from "@/components/Framework/Spinner/TpuSpinner.vue";
import RiLinkUnlinkM from "vue-remix-icons/icons/ri-link-unlink-m.vue";
import { isNumeric } from "@/plugins/isNumeric";
import { Maybe } from "@/gql/graphql";

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
  src: String as () => PropType<Maybe<string> | string | undefined>,
  size: [String, Number],
  gradient: String,
  height: [String, Number],
  width: [String, Number],
  imageClasses: String,
  spinnerSize: [String, Number],
  spinnerInnerWidth: [String, Number],
  parentClasses: {
    type: [String, Array, Object],
    default: ""
  }
});

const dimensions = computed(() => {
  return {
    height: isNumeric(props.height)
      ? props.height + "px"
      : props.height || "100%",
    width: isNumeric(props.width) ? props.width + "px" : props.width || "auto"
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
img {
  transition: opacity 0.2s;
  opacity: 0;
}
img.loaded {
  opacity: 1;
}
</style>
