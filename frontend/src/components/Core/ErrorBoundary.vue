<script lang="ts" setup>
import type {Component} from "vue";
import {onErrorCaptured, ref, useSlots} from "vue";
import DefaultFallback from "./Crash.vue";

export interface VErrorBoundaryProps {
  fallBack?: Component;
  onError?: Function;
  params?: Record<any, any>;
  stopPropagation?: boolean;
}

const props = withDefaults(defineProps<VErrorBoundaryProps>(), {
  fallBack: DefaultFallback,
  onError: () => {
  },
  params: () => ({}),
  stopPropagation: false
});
const emits = defineEmits(["error-captured"]);
const hasError$ = ref(false);
const err$ = ref<Error | null>(null);
const info$ = ref("");
const slots = useSlots();
if (!slots.default && !slots.boundary) {
  console.warn("ErrorBoundary component must have child components.");
}
onErrorCaptured((error: Error, vm, info: string) => {
  // Ignore Axios and HTTP errors to avoid the SPA from crashing on intentional exceptions
  if (error.name === "HttpError" || error.name === "AxiosError") return;
  hasError$.value = true;
  err$.value = error;
  info$.value = info;
  props?.onError(error, vm, info);
  emits("error-captured", {error, vm, info});
  if (props.stopPropagation) return false;
});
</script>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: "VErrorBoundary"
});
</script>

<template>
  <template v-if="!slots.boundary">
    <slot v-if="!hasError$"></slot>
    <component :is="props.fallBack" v-else v-bind="params"/>
  </template>
  <slot
    v-else
    :error="err$"
    :hasError="hasError$"
    :info="info$"
    name="boundary"
    v-bind="params"
  ></slot>
</template>
