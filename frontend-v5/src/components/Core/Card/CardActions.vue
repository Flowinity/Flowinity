<template>
  <tpu-divider></tpu-divider>
  <div
    :class="`p-2 gap-4 flex items-${props.position} justify-${props.position}`"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import TpuDivider from "@/components/Core/Divider/TpuDivider.vue";

const props = defineProps({
  position: {
    type: String as () => "start" | "center" | "end",
    default: "end"
  }
});
</script>

<style scoped></style>
