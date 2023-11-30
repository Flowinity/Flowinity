<template>
  <div class="date-separator" style="font-size: 14px; display: flex">
    <slot name="start" />
    <div
      v-if="position === 'center' || position === 'end'"
      class="date-separator-line"
    ></div>
    <p class="date-separator-block unselectable">
      <slot />
    </p>
    <div
      v-if="position === 'start' || position === 'center'"
      class="date-separator-line"
    ></div>
    <div v-if="$slots.end" class="date-separator-block">
      <slot name="end" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    position: {
      type: String as () => "start" | "center" | "end",
      default: "center"
    }
  }
});
</script>
