<template>
  <div
    class="date-separator"
    style="font-size: 14px; display: flex"
    :style="props.position === 'none' ? 'margin: 0' : ''"
  >
    <slot name="start" />
    <div
      v-if="
        props.position === 'center' ||
        props.position === 'end' ||
        props.position === 'none'
      "
      class="date-separator-line"
    ></div>
    <p v-if="position !== 'none'" class="date-separator-block unselectable">
      <slot />
    </p>
    <div
      v-if="props.position === 'start' || props.position === 'center'"
      class="date-separator-line"
    ></div>
    <div v-if="$slots.end" class="date-separator-block">
      <slot name="end" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  position: {
    type: String as () => "start" | "center" | "end" | "none",
    default: "center"
  }
});
</script>

<style scoped lang="scss">
.date-separator {
  //  margin: 5px 8px 5px 8px;
  display: flex;
  justify-content: center;
}

.date-separator-line {
  height: 12px;
  border-bottom: 2px solid;
  @apply border-outline-dark;
  width: 100%;
}

.comms-new .date-separator-line {
  border-bottom: 1px solid rgb(var(--v-theme-error)) !important;
}

.date-separator-block {
  padding: 0 8px 0 0;
  white-space: nowrap;
  @apply text-medium-emphasis-dark;
}

.comms-new .date-separator-block {
  color: rgb(var(--v-theme-error)) !important;
}
</style>
