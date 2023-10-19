<template>
  <card
    :padding="false"
    :style="{
      maxWidth: props.width + 'px',
      width: props.width + 'px',
      height: props.height + 'px',
      maxHeight: props.height + 'px'
    }"
    class="relative h-full w-full"
    v-wave
  >
    <tpu-img
      :src="src"
      cover
      class="h-full w-full absolute z-5"
      image-classes="rounded-xl"
      :gradient="true"
    ></tpu-img>
    <div
      class="absolute inset-0 flex items-end p-4 bg-gradient-to-b from-opacity-0 to-opacity-100"
    >
      <slot />
    </div>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Core/Card/Card.vue";
import TpuImg from "@/components/Core/Image/TpuImg.vue";

const props = defineProps({
  src: String,
  width: [Number, String],
  height: [Number, String]
});
</script>

<style scoped>
.gradient {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 1));
}
</style>
