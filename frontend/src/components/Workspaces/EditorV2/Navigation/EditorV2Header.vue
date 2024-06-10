<template>
  <teleport v-if="$ui.ready" to="#appbar-under">
    <template v-for="(item, key) in items" :key="key">
      <!-- Spacer -->
      <VSpacer v-if="item.spacer" />
      <!-- Buttons -->
      {{ item.button.icon }}

      <component
        :is="item.button.component"
        v-bind="item.button.componentProps"
        :editor="editor"
        :disabled="item.button.componentProps?.disabled"
      >
        <template
          v-for="(element, slotName, i) in item.button.componentSlots"
          :key="i"
          #[`${slotName}`]="values"
        >
          <component :is="element" v-bind="values?.props" />
        </template>
      </component>

      <!-- Divider -->
      <VDivider v-if="item.divider" vertical class="mx-1 me-2" />
    </template>
  </teleport>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  markRaw,
  onMounted,
  onUnmounted,
  ShallowRef,
  unref,
  watch
} from "vue";
import { Editor } from "@tiptap/vue-3";
import { useProgressiveUIStore } from "@/store/progressive.store";
import { RiStickyNoteLine } from "@remixicon/vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const editor = inject<ShallowRef<Editor>>("editor");

const uiStore = useProgressiveUIStore();

const route = useRoute();

const { t } = useI18n();

const props = defineProps({
  id: {
    type: String,
    required: false
  }
});

const items = computed(() => {
  if (!editor.value) return [];
  const extensions = [...editor.value.extensionManager.extensions];
  const sortExtensions = extensions.sort((arr, acc) => {
    const a = arr.options.sort ?? -1;
    const b = acc.options.sort ?? -1;
    return a - b;
  });

  let menus = [];

  console.log(sortExtensions);

  for (const extension of sortExtensions) {
    const { button, divider = false, spacer = false } = extension.options;
    // TODO: Check if function
    if (!button) continue;

    const _button = button({
      editor: editor.value,
      extension,
      t: unref(t)
    });

    if (Array.isArray(_button)) {
      const menu = _button.map((k, i) => ({
        button: k,
        divider: i === _button.length - 1 ? divider : false,
        spacer: i === 0 ? spacer : false
      }));
      menus = [...menus, ...menu];
      continue;
    }

    menus.push({ button: _button, divider, spacer });
  }

  return menus;
});

function init() {
  uiStore.appBarHeight = 256;

  const item = {
    name: "Placeholder",
    icon: markRaw(RiStickyNoteLine),
    path: route.path
  };
  uiStore.currentNavItem = {
    item,
    rail: []
  };
}

onMounted(() => {
  init();
});

onUnmounted(() => {
  uiStore.appBarHeight = 64;
});

watch(
  () => props.id,
  () => {
    if (props.id) {
      init();
    }
  }
);
</script>
