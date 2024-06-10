import type { OrderedListOptions as TiptapOrderedListOptions } from "@tiptap/extension-ordered-list";
import { OrderedList as TiptapOrderedList } from "@tiptap/extension-ordered-list";

import ActionButton from "./components/ActionButton.vue";

import type { GeneralOptions } from "@/components/Workspaces/EditorV2/Core/types";
import { RiListOrdered } from "@remixicon/vue";

export interface OrderedListOptions
  extends TiptapOrderedListOptions,
    GeneralOptions<OrderedListOptions> {}

export const OrderedList = TiptapOrderedList.extend<OrderedListOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleOrderedList(),
          isActive: () => editor.isActive("orderedList") || false,
          disabled: !editor.can().toggleOrderedList(),
          icon: RiListOrdered,
          tooltip: t("editor.orderedlist.tooltip")
        }
      })
    };
  }
});
