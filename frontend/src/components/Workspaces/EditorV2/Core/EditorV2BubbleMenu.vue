<template>
  <bubble-menu
    :editor="editor"
    :tippy-options="{
      delay: 100,
      animation: 'perspective'
    }"
    v-if="editor"
  >
    <v-card>
      <!--      <v-btn-group density="compact" multiple divided>-->
      <!--        &lt;!&ndash; font selection &ndash;&gt;-->
      <!--        <v-select-->
      <!--          item-text="name"-->
      <!--          item-value="name"-->
      <!--          dense-->
      <!--          hide-details-->
      <!--          label="Font"-->
      <!--          outlined-->
      <!--          persistent-hint-->
      <!--          return-object-->
      <!--        >-->
      <!--          <template #prepend>-->
      <!--            <v-icon>mdi-format-font</v-icon>-->
      <!--          </template>-->
      <!--        </v-select>-->
      <!--        <v-btn-->
      <!--          v-for="item in items"-->
      <!--          size="x-small"-->
      <!--          :key="item.label"-->
      <!--          :disabled="item.isDisabled()"-->
      <!--          @click="item.command()"-->
      <!--          :class="{ 'v-btn&#45;&#45;active': item.isActive() }"-->
      <!--        >-->
      <!--          <component :is="item.icon" />-->
      <!--          <v-tooltip activator="parent" location="top">-->
      <!--            <span>{{ item.tooltip }}</span>-->
      <!--          </v-tooltip>-->
      <!--        </v-btn>-->
      <!--      </v-btn-group>-->
      <v-btn-group multiple>
        <component
          class="rounded-0"
          :is="VBtn"
          v-bind="item.button.componentProps"
          :editor="editor"
          :disabled="item.button.componentProps?.disabled"
          v-for="item in itemsNew"
          :key="item.button"
        >
          <template
            v-for="(element, slotName, i) in item.button.componentSlots"
            :key="i"
            #[`${slotName}`]="values"
          >
            <component :is="element" v-bind="values?.props" />
          </template>
        </component>
      </v-btn-group>
    </v-card>
  </bubble-menu>
</template>

<script lang="ts" setup>
import { BubbleMenu } from "@tiptap/vue-3";
import { computed, h, inject, ShallowRef, unref } from "vue";
import { Editor } from "@tiptap/core";
import { useI18n } from "vue-i18n";
import { RiBold, RiItalic, RiUnderline } from "@remixicon/vue";
import { VBtnToggle, VBtn } from "vuetify/components";

const editor = inject<ShallowRef<Editor>>("editor");

const { t } = useI18n();

function actions(name: string) {
  return {
    tooltip: t(`editor.${name}`),
    label: t(`editor.${name}`),
    isDisabled: () => !editor.value?.can().toggleMark(name),
    isActive: () => editor.value?.isActive(name),
    command: () => editor.value?.chain().focus().toggleMark(name).run()
  };
}

const itemsNew = computed(() => {
  if (!editor.value) return;
  const whitelist = ["bold", "italic", "underline", "fontFamily"];
  // only return whitelist and map
  return editor.value.extensionManager.extensions.reduce((acc, extension) => {
    console.log(extension);
    if (whitelist.includes(extension.name)) {
      const { button, divider = false, spacer = false } = extension.options;
      acc.push({
        button: button({
          editor: editor.value,
          extension,
          t: unref(t)
        }),
        divider,
        spacer
      });
    }
    return acc;
  }, []);
});
</script>
