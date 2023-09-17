<template>
  <div class="date-separator" style="font-size: 14px">
    <div
      class="date-separator-line"
      v-if="position === 'center' || position === 'end'"
    ></div>
    <p class="date-separator-block unselectable">
      <slot />
    </p>
    <div
      class="date-separator-line"
      v-if="position === 'start' || position === 'center'"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Overline",
  props: {
    position: {
      type: String as () => "start" | "center" | "end",
      default: "center"
    }
  }
});
</script>

<style scoped></style>
