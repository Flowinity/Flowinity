import type { HighlightOptions as TiptapHighlightOptions } from "@tiptap/extension-highlight";
import { Highlight as TiptapHighlight } from "@tiptap/extension-highlight";

import HighlightActionButton from "./components/HighlightActionButton.vue";

import type { GeneralOptions } from "@/components/Workspaces/EditorV2/Core/types";
import { RiMarkPenLine, RiTextBlock } from "@remixicon/vue";

export interface HighlightOptions
  extends TiptapHighlightOptions,
    GeneralOptions<HighlightOptions> {}

export const Highlight = TiptapHighlight.extend<HighlightOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      multicolor: true,
      button: ({ editor, t }) => ({
        component: HighlightActionButton,
        componentProps: {
          action: (color?: unknown) => {
            if (typeof color === "string")
              editor.commands.setHighlight({ color });
          },
          isActive: () => editor.isActive("highlight") || false,
          disabled: !editor.can().setHighlight(),
          icon: RiMarkPenLine,
          tooltip: t("editor.highlight.tooltip")
        }
      })
    };
  }
});
