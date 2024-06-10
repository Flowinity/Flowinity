import type { BulletListOptions as TiptapBulletListOptions } from "@tiptap/extension-bullet-list";
import { BulletList as TiptapBulletList } from "@tiptap/extension-bullet-list";

import ActionButton from "./components/ActionButton.vue";

import type { GeneralOptions } from "@/components/Workspaces/EditorV2/Core/types";
import { RiListUnordered } from "@remixicon/vue";

export interface BulletListOptions
  extends TiptapBulletListOptions,
    GeneralOptions<BulletListOptions> {}

export const BulletList = TiptapBulletList.extend<BulletListOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleBulletList(),
          isActive: () => editor.isActive("bulletList") || false,
          disabled: !editor.can().toggleBulletList(),
          icon: RiListUnordered,
          tooltip: t("editor.bulletlist.tooltip")
        }
      })
    };
  }
});
