<template>
  <tpu-divider></tpu-divider>
  <div
    class="p-3 gap-4"
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
import TpuDivider from "@/components/Core/Divider/TpuDivider.vue";

const props = defineProps({
  position: {
    type: String as () => "start" | "center" | "end",
    default: "end"
  },
  double: {
    type: Boolean
  }
});
</script>
