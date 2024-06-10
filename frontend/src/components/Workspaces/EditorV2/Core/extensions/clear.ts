import { Node } from "@tiptap/core";

import ActionButton from "./components/ActionButton.vue";

import type { GeneralOptions } from "@/components/Workspaces/EditorV2/Core/types";
import { RiFormatClear } from "@remixicon/vue";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ClearOptions extends GeneralOptions<ClearOptions> {}

export const Clear = Node.create<ClearOptions>({
  name: "clear",
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () =>
            editor.chain().focus().clearNodes().unsetAllMarks().run(),
          disabled: !editor
            .can()
            .chain()
            .focus()
            .clearNodes()
            .unsetAllMarks()
            .run(),
          icon: RiFormatClear,
          tooltip: t("editor.clear.tooltip")
        }
      })
    };
  }
});
