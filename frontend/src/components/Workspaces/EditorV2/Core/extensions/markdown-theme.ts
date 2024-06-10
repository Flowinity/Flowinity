import { Extension } from "@tiptap/core";

import type { Item } from "./components/ActionMenuButton.vue";
import ActionMenuButton from "./components/ActionMenuButton.vue";

import type { MarkdownThemeProps } from "@/components/Workspaces/EditorV2/Core/constants";
import { DEFAULT_MARKDOWN_THEME_LIST } from "@/components/Workspaces/EditorV2/Core/constants";
import type { GeneralOptions } from "@/components/Workspaces/EditorV2/Core/types";
import { useEditorStore } from "@/store/editor.store";
import { RiMarkdownLine } from "@remixicon/vue";

/**
 * Represents the interface for Markdown theme options, extending GeneralOptions.
 */
export interface MarkdownThemeOptions
  extends GeneralOptions<MarkdownThemeOptions> {
  /**
   * List of available Markdown theme properties
   *
   * @default DEFAULT_MARKDOWN_THEME_LIST
   */
  markdownThemes: MarkdownThemeProps[];
}

export const MarkdownTheme = Extension.create<MarkdownThemeOptions>({
  name: "markdownTheme",

  addOptions() {
    return {
      ...this.parent?.(),
      markdownThemes: DEFAULT_MARKDOWN_THEME_LIST,
      button: ({ editor, extension, t }) => {
        const state = useEditorStore();

        const markdownThemes =
          ([
            ...DEFAULT_MARKDOWN_THEME_LIST,
            ...extension.options.markdownThemes
          ] as MarkdownThemeProps[]) || [];

        const items: Item[] = markdownThemes.map((k) => ({
          title: t(k.title),
          isActive: () => {
            return state.defaultMarkdownTheme === k.value;
          },
          action: () => {
            state.defaultMarkdownTheme = k.value;
          },
          divider: k.divider ?? false,
          default: k.default ?? false
        }));

        return {
          component: ActionMenuButton,
          componentProps: {
            icon: RiMarkdownLine,
            tooltip: t("editor.markdownTheme.tooltip"),
            items
          }
        };
      }
    };
  }
});
