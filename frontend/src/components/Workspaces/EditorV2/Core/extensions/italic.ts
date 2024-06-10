import type { ItalicOptions as TiptapItalicOptions } from "@tiptap/extension-italic";
import { Italic as TiptapItalic } from "@tiptap/extension-italic";

import ActionButton from "./components/ActionButton.vue";

import type { GeneralOptions } from "@/components/Workspaces/EditorV2/Core/types";
import { RiItalic } from "@remixicon/vue";

export interface ItalicOptions
  extends TiptapItalicOptions,
    GeneralOptions<ItalicOptions> {}

export const Italic = TiptapItalic.extend<ItalicOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleItalic(),
          isActive: () => editor.isActive("italic") || false,
          disabled: !editor.can().toggleItalic(),
          icon: RiItalic,
          tooltip: t("editor.italic.tooltip")
        }
      })
    };
  }
});
