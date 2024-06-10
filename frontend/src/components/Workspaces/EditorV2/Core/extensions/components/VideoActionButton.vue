<script setup lang="ts">
import { ref, VNode } from "vue";
import type { Editor } from "@tiptap/vue-3";

import ActionButton from "./ActionButton.vue";
import { ButtonViewReturnComponentProps } from "@/components/Workspaces/EditorV2/Core/types";

interface Props {
  editor: Editor;

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

const src = ref<string | undefined>(undefined);

function onAction() {
  const { src: _src } = props.editor.getAttributes("video");
  src.value = _src;
}
</script>

<template>
  <ActionButton
    :icon="icon"
    :tooltip="tooltip"
    :disabled="disabled"
    :color="color"
    :is-active="isActive"
    :action="onAction"
  >
    <slot name="dialog" :props="{ editor, value: src }"></slot>
  </ActionButton>
</template>
