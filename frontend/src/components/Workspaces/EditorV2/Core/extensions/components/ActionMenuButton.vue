<script setup lang="ts">
import { StyleValue, VNode } from "vue";
import { computed, ref } from "vue";
import { ButtonViewReturnComponentProps } from "@/components/Workspaces/EditorV2/Core/types";

export interface Item {
  title: string;
  icon?: VNode;
  isActive: NonNullable<ButtonViewReturnComponentProps["isActive"]>;
  action?: ButtonViewReturnComponentProps["action"];
  style?: StyleValue;
  disabled?: boolean;
  divider?: boolean;
  default?: boolean;
}

interface Props {
  editor: Editor;
  disabled?: boolean;
  color?: string;
  maxHeight?: string | number;

  icon?: VNode;
  tooltip?: string;
  items?: Item[];
}
import ActionButton from "./ActionButton.vue";
import { Editor } from "@tiptap/vue-3";

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  color: undefined,
  maxHeight: undefined,

  icon: undefined,
  tooltip: "",
  items: () => []
});

const menu = ref<boolean>(false);

const active = computed<Item>(() => {
  const find = props.items.find((k) => k.isActive());
  if (find && !find.default) {
    return {
      ...find,
      icon: find.icon ? find.icon : props.icon
    };
  }

  const item: Item = {
    title: props.tooltip,
    icon: props.icon,
    isActive: () => false
  };

  return item;
});
</script>

<template>
  <ActionButton
    :icon="active.icon"
    :tooltip="active.title"
    :disabled="disabled"
    :color="color"
    :is-active="active.isActive"
  >
    <VMenu v-model="menu" activator="parent">
      <VList density="compact" :max-height="maxHeight">
        <template v-for="(item, i) in items" :key="i">
          <VListItem
            :active="item.isActive()"
            :disabled="item.disabled"
            @click="item.action"
          >
            <template #prepend>
              <component :is="item.icon" v-if="item.icon" />
            </template>

            <VListItem-title :style="item.style">
              {{ item.title }}
            </VListItem-title>
          </VListItem>

          <VDivider v-if="item.divider" />
        </template>
      </VList>
    </VMenu>
  </ActionButton>
</template>
