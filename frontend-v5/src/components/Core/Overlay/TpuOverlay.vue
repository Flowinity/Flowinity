<template>
  <component
    :is="props.component || 'div'"
    class="flex items-center justify-center z-50"
    :class="{
      fixed: !props.absolute,
      absolute: props.absolute,
      'inset-0': modelValue
    }"
    v-bind="$attrs"
  >
    <div>
      <div
        v-if="props.modelValue"
        class="inset-0 bg-black opacity-50"
        :class="{ fixed: !props.absolute, absolute: props.absolute }"
      ></div>
      <div class="relative" v-if="props.modelValue">
        <slot></slot>
      </div>
    </div>
  </component>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  absolute: Boolean,
  component: String
});
defineEmits(["update:modelValue"]);
</script>
