<script setup lang="ts">
import theme from "@/plugins/theme";
import { computed, ref } from "vue";
import TpuImg from "@/components/Framework/Image/TpuImg.vue";
import { isNumeric } from "@/plugins/isNumeric";

const props = defineProps({
  size: {
    default: 24,
    type: [Number, String]
  },
  src: {
    type: String
  },
  color: {
    type: [String, Boolean]
  },
  alt: {
    type: String
  }
});

const error = ref(false);

function loadError() {
  console.log("error");
  error.value = true;
}

const dimensions = computed(() => {
  return isNumeric(props.size) ? props.size + "px" : props.size || "100%";
});
</script>

<template>
  <div class="relative">
    <slot name="outer" />

    <div
      class="rounded-full whitespace-nowrap overflow-hidden overflow-ellipsis select-none relative"
      :class="{ gradient: props.color === true }"
      :style="{
        minWidth: dimensions,
        maxWidth: dimensions,
        minHeight: dimensions,
        maxHeight: dimensions,
        height: dimensions,
        width: dimensions,
        background:
          props.color !== undefined && !error
            ? theme.colors[props.color || 'blue']
            : undefined
      }"
      v-bind="$attrs"
    >
      <template v-if="props.src && !error">
        <tpu-img
          :height="size || 24"
          :width="size || 24"
          style="width: 100%; height: 100%"
          :src="props.src"
          :cover="true"
          :alt="props.alt || 'Avatar'"
          :spinner-size="24"
          :spinner-inner-width="6"
          @error="loadError"
        />
      </template>
      <template v-else>
        <div class="flex items-center justify-center h-full">
          <slot />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.gradient {
  background: linear-gradient(to bottom, #03b8f8, #4181ea) !important;
}
</style>
