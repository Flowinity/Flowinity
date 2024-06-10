import { defineStore } from "pinia";
import { AnyExtension } from "@tiptap/core";
import { Ref, ref } from "vue";
import { DEFAULT_MARKDOWN_THEME_VALUE } from "@/components/Workspaces/EditorV2/Core/constants";

export const useEditorStore = defineStore("editor", () => {
  const extensions: Ref<AnyExtension[]> = ref([]);
  const color = ref<string | undefined>(undefined);
  const highlight = ref<string | undefined>(undefined);
  const defaultMarkdownTheme = ref<string | undefined>(
    DEFAULT_MARKDOWN_THEME_VALUE
  );

  return {
    extensions,
    color,
    highlight,
    defaultMarkdownTheme
  };
});
