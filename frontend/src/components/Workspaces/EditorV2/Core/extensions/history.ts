import type { HistoryOptions as TiptapHistoryOptions } from "@tiptap/extension-history";
import { History as TiptapHistory } from "@tiptap/extension-history";

import ActionButton from "./components/ActionButton.vue";

import type { GeneralOptions } from "@/components/Workspaces/EditorV2/Core/types";
import { RiArrowGoBackLine, RiArrowGoForwardLine } from "@remixicon/vue";

export interface HistoryOptions
  extends TiptapHistoryOptions,
    GeneralOptions<HistoryOptions> {}

export const History = TiptapHistory.extend<HistoryOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      depth: 10,
      button: ({ editor, t }) => {
        const historys: ["undo", "redo"] = ["undo", "redo"];

        return historys.map((item) => ({
          component: ActionButton,
          componentProps: {
            action: () => {
              if (item === "undo") editor.commands.undo();
              if (item === "redo") editor.commands.redo();
            },
            disabled: !editor.can()[item](),
            icon: item === "undo" ? RiArrowGoBackLine : RiArrowGoForwardLine,
            tooltip: t(`editor.${item}.tooltip`)
          }
        }));
      }
    };
  }
});
