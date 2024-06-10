import type { CodeBlockOptions as TiptapCodeBlockOptions } from "@tiptap/extension-code-block";
import { CodeBlock as TiptapCodeBlock } from "@tiptap/extension-code-block";

import ActionButton from "./components/ActionButton.vue";

import type { GeneralOptions } from "@/components/Workspaces/EditorV2/Core/types";
import { RiCodeBlock } from "@remixicon/vue";

export interface CodeBlockOptions
  extends TiptapCodeBlockOptions,
    GeneralOptions<CodeBlockOptions> {}

export const CodeBlock = TiptapCodeBlock.extend<CodeBlockOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleCodeBlock(),
          isActive: () => editor.isActive("codeBlock") || false,
          disabled: !editor.can().toggleCodeBlock(),
          icon: RiCodeBlock,
          tooltip: t("editor.codeblock.tooltip")
        }
      })
    };
  }
});
