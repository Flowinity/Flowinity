import type { HorizontalRuleOptions as TiptapHorizontalRuleOptions } from "@tiptap/extension-horizontal-rule";
import { HorizontalRule as TiptapHorizontalRule } from "@tiptap/extension-horizontal-rule";

import ActionButton from "./components/ActionButton.vue";

import type { GeneralOptions } from "@/components/Workspaces/EditorV2/Core/types";
import { RiSeparator } from "@remixicon/vue";

export interface HorizontalRuleOptions
  extends TiptapHorizontalRuleOptions,
    GeneralOptions<HorizontalRuleOptions> {}

export const HorizontalRule =
  TiptapHorizontalRule.extend<HorizontalRuleOptions>({
    addOptions() {
      return {
        ...this.parent?.(),
        button: ({ editor, t }) => ({
          component: ActionButton,
          componentProps: {
            action: () => editor.commands.setHorizontalRule(),
            disabled: !editor.can().setHorizontalRule(),
            icon: RiSeparator,
            tooltip: t("editor.horizontalrule.tooltip")
          }
        })
      };
    }
  });
