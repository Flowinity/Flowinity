<template>
  <tpu-divider></tpu-divider>
  <div
    class="py-3 px-3 gap-4"
    :class="{ 'flex justify-between': double }"
    v-bind="$attrs"
  >
    <slot name="start" />
    <div
      :class="`flex flex-wrap justify-${position} items-${position} content-${position} gap-4`"
    >
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import TpuDivider from "@/components/Framework/Divider/TpuDivider.vue";

defineProps({
  position: {
    type: String as () => "start" | "center" | "end",
    default: "end"
  },
  double: {
    type: Boolean
  }
});
</script>
