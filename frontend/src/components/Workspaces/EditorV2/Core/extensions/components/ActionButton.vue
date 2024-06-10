<script setup lang="ts">
import { computed, VNode } from "vue";
import { ButtonViewReturnComponentProps } from "@/components/Workspaces/EditorV2/Core/types";

interface Props {
  icon?: VNode;
  tooltip?: string;
  disabled?: boolean;
  color?: string;
  action?: ButtonViewReturnComponentProps["action"];
  isActive?: ButtonViewReturnComponentProps["isActive"];
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  tooltip: undefined,
  disabled: false,
  color: undefined,
  action: undefined,
  isActive: undefined
});
</script>

<template>
  <VBtn
    class="rounded me-1 ms-0"
    density="comfortable"
    size="small"
    :disabled="disabled"
    :color="color"
    icon
    :class="{
      'v-btn--active': isActive?.()
    }"
    @click="action"
  >
    <component :is="icon" v-if="icon" />

    <VTooltip
      :eager="false"
      activator="parent"
      location="top"
      :text="props.tooltip"
    />

    <slot></slot>
  </VBtn>
</template>
