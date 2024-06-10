// StarterKit
import type { AnyExtension } from "@tiptap/core";
import { Extension } from "@tiptap/core";
import type { CharacterCountOptions } from "@tiptap/extension-character-count";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Document } from "@tiptap/extension-document";
import type { DropcursorOptions } from "@tiptap/extension-dropcursor";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import type { FocusOptions } from "@tiptap/extension-focus";
import Focus from "@tiptap/extension-focus";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import type { HardBreakOptions } from "@tiptap/extension-hard-break";
import { HardBreak } from "@tiptap/extension-hard-break";
import type { ListItemOptions } from "@tiptap/extension-list-item";
import { ListItem } from "@tiptap/extension-list-item";
import type { ParagraphOptions } from "@tiptap/extension-paragraph";
import { Paragraph } from "@tiptap/extension-paragraph";
import type { PlaceholderOptions } from "@tiptap/extension-placeholder";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Text } from "@tiptap/extension-text";
import type { TextStyleOptions } from "@tiptap/extension-text-style";
import { TextStyle } from "@tiptap/extension-text-style";

import type { BubbleOptions } from "./components/bubble";
import { defaultBubbleList, generateBubbleTypeMenu } from "./components/bubble";

import { NODE_TYPE_MENU } from "@/components/Workspaces/EditorV2/Core/constants";

/**
 * Represents the interface for options in the base toolkit.
 */
export interface BaseKitOptions {
  /**
   * Whether to enable the document option
   *
   * @default true
   */
  document: false;

  /**
   * Whether to enable the text option
   *
   * @default true
   */
  text: false;

  /**
   * Whether to enable the Gapcursor
   *
   * @default true
   */
  gapcursor: false;

  /**
   * Dropcursor options or false, indicating whether to enable the drop cursor
   *
   * @default true
   */
  dropcursor: Partial<DropcursorOptions> | false;

  /**
   * character count options or false, indicating whether to enable character count
   *
   * @default true
   */
  characterCount: Partial<CharacterCountOptions> | false;

  /**
   * HardBreak options or false, indicating whether to enable hard breaks
   *
   * @default true
   */
  hardBreak: Partial<HardBreakOptions> | false;

  /**
   * Placeholder options or false, indicating whether to enable placeholders
   *
   * @default true
   */
  placeholder: Partial<PlaceholderOptions> | false;

  /**
   * Paragraph options or false, indicating whether to enable paragraph functionality
   *
   * @default true
   */
  paragraph: Partial<ParagraphOptions> | false;

  /**
   * Focus options or false, indicating whether to enable focus functionality
   *
   * @default true
   */
  focus: Partial<FocusOptions> | false;

  /**
   * ListItem options or false, indicating whether to enable list item functionality
   *
   * @default true
   */
  listItem: Partial<ListItemOptions> | false;

  /**
   * Text Style options or false, indicating whether to enable text style functionality
   *
   * @default true
   */
  textStyle: Partial<TextStyleOptions> | false;

  /**
   * Bubble options, taking `BubbleOptions<BaseKitOptions>` as parameters, indicating whether to enable the bubble functionality
   */
  bubble: Partial<BubbleOptions<BaseKitOptions>>;
}

export const BaseKit = Extension.create<BaseKitOptions>({
  name: "base-kit",

  addOptions() {
    return {
      ...this.parent?.(),
      bubble: {
        list: NODE_TYPE_MENU,
        defaultBubbleList,
        button: ({ editor, extension, t }) => {
          const { list = {}, defaultBubbleList } =
            extension.options?.bubble ?? {};
          const defaultList = defaultBubbleList?.(editor) ?? [];
          return generateBubbleTypeMenu(list, defaultList, {
            editor,
            extension,
            t
          });
        }
      }
    };
  },

  addExtensions() {
    return [
      Placeholder.configure({
        placeholder: "",
        ...this.options.placeholder
      }),
      Focus.configure({
        className: "focus",
        ...this.options.focus
      }),
      Document.configure(),
      Text.configure(),
      Gapcursor.configure(),
      Dropcursor.configure(this.options.dropcursor),
      CharacterCount.configure(this.options.characterCount),
      Paragraph.configure(this.options.paragraph),
      HardBreak.configure(this.options.hardBreak),
      ListItem.configure(this.options.listItem),
      TextStyle.configure(this.options.textStyle)
    ];
  }
});
