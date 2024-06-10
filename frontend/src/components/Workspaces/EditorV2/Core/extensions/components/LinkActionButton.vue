<script setup lang="ts">
import { ref, VNode } from "vue";
import type { Editor } from "@tiptap/vue-3";

import type { LinkAttrs } from "./link/types";
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

const attrs = ref<LinkAttrs>({
  href: undefined,
  target: undefined,
  rel: undefined
});

function onAction() {
  const { href, target, rel } = props.editor.getAttributes("link");
  attrs.value = {
    href,
    target,
    rel
  };
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
    <slot name="dialog" :props="{ editor, value: attrs.href, ...attrs }"></slot>
  </ActionButton>
</template>
