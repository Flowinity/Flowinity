import type { UnderlineOptions as TiptapUnderlineOptions } from "@tiptap/extension-underline";
import { Underline as TiptapUnderline } from "@tiptap/extension-underline";

import ActionButton from "./components/ActionButton.vue";

import type { GeneralOptions } from "@/components/Workspaces/EditorV2/Core/types";
import { RiUnderline } from "@remixicon/vue";

export interface UnderlineOptions
  extends TiptapUnderlineOptions,
    GeneralOptions<UnderlineOptions> {}

export const Underline = TiptapUnderline.extend<UnderlineOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleUnderline(),
          isActive: () => editor.isActive("underline") || false,
          disabled: !editor.can().toggleUnderline(),
          icon: RiUnderline,
          tooltip: t("editor.underline.tooltip")
        }
      })
    };
  }
});
