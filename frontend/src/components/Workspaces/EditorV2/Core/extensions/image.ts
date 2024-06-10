import type { ImageOptions as TiptapImageOptions } from "@tiptap/extension-image";
import { Image as TiptapImage } from "@tiptap/extension-image";
import { VueNodeViewRenderer } from "@tiptap/vue-3";

import AddAttachment from "@/components/Communications/Menus/AddAttachment.vue";
import ImageView from "./components/image/ImageView.vue";
import type {
  Display,
  ImageAttrsOptions,
  ImageTab,
  ImageTabKey
} from "./components/image/types";
import ImageActionButton from "./components/ImageActionButton.vue";

import { IMAGE_SIZE } from "@/components/Workspaces/EditorV2/Core/constants";
import type { GeneralOptions } from "@/components/Workspaces/EditorV2/Core/types";
import { RiImageLine } from "@remixicon/vue";
import { h } from "vue";

/**
 * Represents the type for the upload function, which takes a File parameter and returns a Promise of type string.
 */
type Upload = (file: File) => Promise<string>;

/**
 * Represents the interface for image options, extending TiptapImageOptions and GeneralOptions.
 */
export interface ImageOptions
  extends TiptapImageOptions,
    GeneralOptions<ImageOptions> {
  /** Function for uploading images */
  upload?: Upload;
  /** image default width */
  width?: string | number;
  /** image default display */
  display: Display;
  /** List of image tabs */
  imageTabs: ImageTab[];
  /** List of hidden image tab keys */
  hiddenTabs: ImageTabKey[];
  /** Component for the image dialog */
  dialogComponent: any;
}

/**
 * Represents the interface for options to set image attributes, extending ImageAttrsOptions and including the src property.
 */
interface SetImageAttrsOptions extends ImageAttrsOptions {
  /** The source URL of the image. */
  src: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageResize: {
      /**
       * Add an image
       */
      setImage: (options: Partial<SetImageAttrsOptions>) => ReturnType;
      /**
       * Update an image
       */
      updateImage: (options: Partial<SetImageAttrsOptions>) => ReturnType;
    };
  }
}

export const Image = TiptapImage.extend<ImageOptions>({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null
      },
      alt: {
        default: null
      },
      lockAspectRatio: {
        default: true
      },
      width: {
        default: this.options.width
      },
      height: {
        default: null
      },
      display: {
        default: this.options.display,
        renderHTML: ({ display }) => {
          if (!display) {
            return {};
          }

          return {
            "data-display": display
          };
        },
        parseHTML: (element) => {
          const display = element.getAttribute("data-display");
          return display || "inline";
        }
      }
    };
  },
  addNodeView() {
    return VueNodeViewRenderer(ImageView);
  },
  addCommands() {
    return {
      ...this.parent?.(),
      updateImage:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, options);
        }
    };
  },
  addOptions() {
    return {
      ...this.parent?.(),
      upload: undefined,
      width: IMAGE_SIZE["size-large"],
      display: "inline",
      imageTabs: [],
      hiddenTabs: [],
      inline: true,
      dialogComponent: () =>
        h(AddAttachment, {
          modelValue: false,
          "@fileUpload": () => {
            console.log("test");
          }
        }),
      button: ({ editor, extension, t }) => {
        const { upload, imageTabs, hiddenTabs, dialogComponent } =
          extension.options;

        return {
          component: ImageActionButton,
          componentProps: {
            editor,
            upload,
            imageTabs,
            hiddenTabs,
            isActive: () => editor.isActive("image") || false,
            disabled: !editor.can().setImage({}),
            icon: RiImageLine,
            tooltip: t("editor.image.tooltip")
          },
          componentSlots: {
            dialog: dialogComponent()
          }
        };
      }
    };
  }
});
