import type { CodeOptions as TiptapCodeOptions } from "@tiptap/extension-code";
import { Code as TiptapCode } from "@tiptap/extension-code";

import ActionButton from "./components/ActionButton.vue";

import type { GeneralOptions } from "@/components/Workspaces/EditorV2/Core/types";
import { RiCodeLine } from "@remixicon/vue";

export interface CodeOptions
  extends TiptapCodeOptions,
    GeneralOptions<CodeOptions> {}

export const Code = TiptapCode.extend<CodeOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleCode(),
          isActive: () => editor.isActive("code") || false,
          disabled: !editor.can().toggleCode(),
          icon: RiCodeLine,
          tooltip: t("editor.code.tooltip")
        }
      })
    };
  }
});
