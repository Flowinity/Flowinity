import type { TextAlignOptions as TiptapTextAlignOptions } from "@tiptap/extension-text-align";
import { TextAlign as TiptapTextAlign } from "@tiptap/extension-text-align";

import ActionMenuButton from "./components/ActionMenuButton.vue";

import { GeneralOptions } from "../types";
import { RiAlignCenter, RiAlignLeft, RiAlignRight } from "@remixicon/vue";
import { Editor } from "@tiptap/vue-3";
import { AnyExtension } from "@tiptap/core";
import type { Item } from "@/components/Workspaces/EditorV2/Core/extensions/components/ActionMenuButton.vue";

/** Represents the type for text alignments */
type Alignments = "left" | "center" | "right" | "justify";

/**
 * Represents the interface for text align options, extending TiptapTextAlignOptions and GeneralOptions.
 */
export interface TextAlignOptions
  extends TiptapTextAlignOptions,
    GeneralOptions<TextAlignOptions> {
  /**
   * List of available alignment options
   *
   * @default ['left', 'center', 'right', 'justify']
   */
  alignments: Alignments[];
}

export const TextAlign = TiptapTextAlign.extend<TextAlignOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      types: ["heading", "paragraph", "image"],
      button: ({
        editor,
        extension,
        t
      }: {
        editor: Editor;
        extension: AnyExtension;
        t: (key: string) => string;
      }) => {
        const alignments =
          (extension.options?.alignments as Alignments[]) || [];

        const items: Item[] = alignments.map((k) => ({
          title: t(`editor.textalign.${k}.tooltip`),
          icon:
            k === "left"
              ? RiAlignLeft
              : k === "center"
                ? RiAlignCenter
                : RiAlignRight,
          isActive: () => editor.isActive({ textAlign: k }) || false,
          action: () => editor.commands.setTextAlign(k),
          disabled: !editor.can().setTextAlign(k)
        }));

        const disabled =
          items.filter((k) => k.disabled).length === items.length;

        return {
          component: ActionMenuButton,
          componentProps: {
            icon: RiAlignCenter,
            tooltip: t("editor.textalign.tooltip"),
            disabled,
            items
          }
        };
      }
    };
  }
});
