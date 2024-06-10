import type { BlockquoteOptions as TiptapBlockquoteOptions } from "@tiptap/extension-blockquote";
import { Blockquote as TiptapBlockquote } from "@tiptap/extension-blockquote";

import ActionButton from "./components/ActionButton.vue";

import type { GeneralOptions } from "@/components/Workspaces/EditorV2/Core/types";
import { RiQuoteText } from "@remixicon/vue";

export interface BlockquoteOptions
  extends TiptapBlockquoteOptions,
    GeneralOptions<BlockquoteOptions> {}

export const Blockquote = TiptapBlockquote.extend<BlockquoteOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: "blockquote"
      },
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleBlockquote(),
          isActive: () => editor.isActive("blockquote") || false,
          disabled: !editor.can().toggleBlockquote(),
          icon: RiQuoteText,
          tooltip: t("editor.blockquote.tooltip")
        }
      })
    };
  }
});
