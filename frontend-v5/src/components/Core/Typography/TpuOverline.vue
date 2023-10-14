<template>
  <div class="date-separator" style="font-size: 14px; display: flex">
    <slot name="start" />
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
    <div class="date-separator-block" v-if="$slots.end">
      <slot name="end" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TpuOverline",
  props: {
    position: {
      type: String as () => "start" | "center" | "end",
      default: "center"
    }
  }
});
</script>

<style scoped>
.date-separator {
  margin: 5px 8px 5px 8px;
  display: flex;
  justify-content: center;
}

.date-separator-line {
  height: 12px;
  border-bottom: 1px solid;
  @apply border-medium-emphasis-dark;
  mix-blend-mode: difference;
  width: 100%;
}

.comms-new .date-separator-line {
  border-bottom: 1px solid rgb(var(--v-theme-error)) !important;
}

.date-separator-block {
  padding: 0 8px;
  white-space: nowrap;
  @apply text-medium-emphasis-dark;
  mix-blend-mode: difference;
}

.comms-new .date-separator-block {
  color: rgb(var(--v-theme-error)) !important;
}
</style>
