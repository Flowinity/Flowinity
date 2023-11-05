<template>
  <component
    :is="props.to ? RouterLink : 'a'"
    class="rounded-full flex dark:text-white select-none"
    v-wave="!disabled && !table && !noRipple"
    :to="to ? to : undefined"
    :href="href ? href : undefined"
    :style="{
      background:
        variant === 'tonal' || selected ? `rgb(${rgbColor})` : undefined,
      color:
        variant === 'tonal' || variant === 'passive' || selected
          ? color
          : undefined,
      'margin-left': table ? '-0.75rem' : '0'
    }"
    :class="{
      'outline dark:outline-outline-dark': variant === 'outlined',
      'px-2 py-2': icon,
      'px-3 py-1': !icon,
      'opacity-50 pointer-events-none': disabled,
      'cursor-pointer': !disabled && !noRipple
    }"
    tabindex="0"
    @keydown.enter="
      disabled
        ? () => {}
        : () => {
            $event.target.click();
          }
    "
    @keydown.space="
      disabled
        ? () => {}
        : () => {
            $event.preventDefault();
            $event.target.click();
          }
    "
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template v-if="!loading">
      <slot />
    </template>
    <template v-else>
      <tpu-spinner :color="color" :size="20" />
    </template>
  </component>
</template>

<script setup lang="ts">
import theme from "@/plugins/theme";
import { computed } from "vue";
import TpuSpinner from "@/components/Framework/Spinner/TpuSpinner.vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  icon: Boolean,
  to: String,
  href: String,
  color: String,
  variant: {
    type: String as () => "outlined" | "tonal" | "passive",
    default: "tonal"
  },
  table: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  },
  noRipple: {
    type: Boolean,
    default: false
  }
});

const color = computed(() => {
  if (
    props.variant !== "tonal" &&
    props.variant !== "passive" &&
    !props.selected
  ) {
    return "#ffffff";
  }
  return theme.colors[props.color] || theme.colors["white"];
});

const rgbColor = computed(() => {
  if (!color.value) return;
  const [r, g, b] = color.value.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `${r},${g},${b},0.15`;
});
</script>

<style scoped>
:deep(.remixicon) {
  fill: v-bind(color);
}
</style>
