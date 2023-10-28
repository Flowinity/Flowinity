<template>
  <div class="flex flex-col items-center" style="width: 100%">
    <div
      class="relative"
      id="image-editor"
      ref="editor"
      @click="mouseOverAction = ''"
    >
      <img
        :src="image"
        style="user-select: none; user-drag: none; -webkit-user-drag: none"
        v-memo="[image]"
        ref="imageRef"
        class="select-none pointer-events-none"
      />
      <div
        v-for="(annotation, index) in annotations"
        :key="annotation.id"
        class="absolute text-xl text-white"
        :style="{
          top: annotation.top - 10 + 'px',
          left: annotation.left + 'px'
        }"
      >
        <VDropdown
          :triggers="[]"
          placement="top-start"
          class="flex items-center"
          :shown="mouseOverAction === annotation.id && !isDragging"
          :autoHide="false"
        >
          <text-field
            style="border-bottom: none; margin-top: 0; margin-bottom: 0"
            :style="{
              'font-size': annotation.size + 'px',
              color: annotation.color,
              fontFamily: `${annotation.properties?.font}', sans-serif`
            }"
            v-model="annotation.value"
            :dynamic-width="true"
            :id="`editor-input-${annotation.id}`"
            autofocus
            :key="`${annotation.size}`"
            @click.prevent.stop="mouseOverAction = annotation.id"
            v-if="annotation.type === 'text'"
          >
            <RiDragMoveLine
              class="ml-2"
              :style="{
                width: annotation.size + 'px',
                fill: annotation.color
              }"
              @mousedown.stop="startDrag(annotation.id, $event)"
              v-if="!renderMode"
            />
          </text-field>
          <div
            v-else-if="
              annotation.type === 'box' || annotation.type === 'emptyBox'
            "
            :style="{
              width: annotation.properties?.width + 'px',
              height: annotation.properties?.height + 'px',
              background:
                annotation.type === 'box' ? annotation.color : undefined,
              resize: !renderMode ? 'both' : undefined,
              borderColor:
                annotation.type === 'emptyBox' ? annotation.color : undefined,
              minWidth: '20px',
              minHeight: '20px'
            }"
            :class="{ 'border-2': annotation.type === 'emptyBox' }"
            :id="`editor-input-${annotation.id}`"
            style="overflow: auto"
            v-once
            @click.prevent.stop="forceSize(annotation.id)"
            @mouseup="forceSize(annotation.id)"
          >
            <div
              style="height: calc(100% - 20px); width: 100%"
              @click.prevent.stop="mouseOverAction = annotation.id"
              @mousedown="startDrag(annotation.id, $event)"
            ></div>
          </div>
          <div
            v-else-if="annotation.type === 'arrow'"
            class="arrow"
            @click.prevent.stop="mouseOverAction = annotation.id"
          >
            <div
              class="stem"
              :style="{ backgroundColor: annotation.color }"
            ></div>
            <div
              class="arrowhead"
              :style="{ 'border-bottom-color': annotation.color }"
            ></div>
          </div>
          <template #popper>
            <card v-if="!renderMode">
              <Transition mode="out-in" name="slide-up" appear>
                <div class="fill-white flex">
                  <VDropdown
                    v-if="annotation.type === 'text'"
                    :triggers="['click']"
                    placement="right"
                    class="flex items-center"
                  >
                    <tpu-button icon variant="passive">
                      <RiFontSize style="width: 20px" />
                    </tpu-button>
                    <template #popper>
                      <card :padding="false" class="py-1">
                        <tpu-list>
                          <tpu-list-item
                            v-for="size in fontSizes"
                            @click="annotation.size = size.value"
                            :key="size.value"
                          >
                            {{ size.name }}
                          </tpu-list-item>
                        </tpu-list>
                      </card>
                    </template>
                  </VDropdown>
                  <VDropdown
                    v-if="annotation.type === 'text'"
                    :triggers="['click']"
                    placement="right"
                    class="flex items-center"
                  >
                    <tpu-button icon variant="passive">
                      <RiFontSize style="width: 20px" />
                    </tpu-button>
                    <template #popper>
                      <card :padding="false" class="py-1">
                        <tpu-list>
                          <tpu-list-item
                            v-for="font in fonts"
                            @click="annotation.properties!!.font = font.value"
                            :key="font.value"
                          >
                            {{ font.name }}
                          </tpu-list-item>
                        </tpu-list>
                      </card>
                    </template>
                  </VDropdown>
                  <VDropdown
                    :triggers="['click']"
                    placement="right"
                    class="flex items-center"
                    @mouseover="mouseOverAction = annotation.id"
                  >
                    <tpu-button icon variant="passive">
                      <RiFontColor style="width: 20px" />
                    </tpu-button>
                    <template #popper>
                      <card :padding="false" class="py-1">
                        <tpu-list>
                          <tpu-list-item
                            v-for="color in colors"
                            @click="annotation.color = color.value"
                            :key="color.value"
                          >
                            {{ color.name }}
                          </tpu-list-item>
                        </tpu-list>
                      </card>
                    </template>
                  </VDropdown>
                  <tpu-button
                    icon
                    variant="passive"
                    @click="move(index + 1, annotation)"
                  >
                    <RiArrowUpLine style="width: 20px" />
                  </tpu-button>
                  <tpu-button
                    icon
                    variant="passive"
                    :disabled="index === 0"
                    @click="move(index - 1, annotation)"
                  >
                    <RiArrowDownLine style="width: 20px" />
                  </tpu-button>
                  <tpu-button
                    icon
                    variant="passive"
                    color="red"
                    @click="annotations.splice(index, 1)"
                  >
                    <RiDeleteBinLine style="width: 20px" />
                  </tpu-button>
                </div>
              </Transition>
            </card>
          </template>
        </VDropdown>
      </div>
    </div>
    <div id="test-space" />
    <div class="flex items-center gap-3 justify-center my-2" v-once>
      <tpu-button
        @click="$emit('back')"
        icon
        variant="outlined"
        v-tooltip.top="$t('gallery.editor.back')"
      >
        <RiArrowGoBack style="width: 20px" />
      </tpu-button>
      <tpu-button
        @click="addAnnotation('text')"
        icon
        variant="outlined"
        v-tooltip.top="$t('gallery.editor.addText')"
      >
        <RiText style="width: 20px" />
      </tpu-button>
      <tpu-button
        @click="addAnnotation('box')"
        icon
        variant="outlined"
        v-tooltip.top="$t('gallery.editor.addBox')"
      >
        <RiCheckboxBlankFill style="width: 20px" />
      </tpu-button>
      <tpu-button
        @click="addAnnotation('emptyBox')"
        icon
        variant="outlined"
        v-tooltip.top="$t('gallery.editor.addEmptyBox')"
      >
        <RiCheckboxBlankLine style="width: 20px" />
      </tpu-button>
      <tpu-button
        @click="addAnnotation('arrow')"
        icon
        v-if="false"
        variant="outlined"
        v-tooltip.top="$t('gallery.editor.addEmptyBox')"
      >
        <RiArrowRightFill style="width: 20px" />
      </tpu-button>
      <tpu-button
        @click="drawAnnotations(false)"
        icon
        variant="outlined"
        v-tooltip.top="$t('gallery.editor.saveCopy')"
      >
        <RiSaveLine style="width: 20px" />
      </tpu-button>
      <tpu-button
        @click="drawAnnotations(false, true)"
        icon
        variant="outlined"
        v-tooltip.top="$t('gallery.editor.saveCopy')"
      >
        render
      </tpu-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUpdated, watch, nextTick } from "vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import Card from "@/components/Framework/Card/Card.vue";
import RiFontSize from "vue-remix-icons/icons/ri-font-size.vue";
import TpuOverline from "@/components/Framework/Typography/TpuOverline.vue";
import TpuList from "@/components/Framework/List/TpuList.vue";
import TpuListItem from "@/components/Framework/List/TpuListItem.vue";
import RiText from "vue-remix-icons/icons/ri-text.vue";
import RiSaveLine from "vue-remix-icons/icons/ri-save-line.vue";
import html2canvas from "html2canvas";
import RiFontColor from "vue-remix-icons/icons/ri-font-color.vue";
import RiDragMoveLine from "vue-remix-icons/icons/ri-drag-move-line.vue";
import RiDeleteBinLine from "vue-remix-icons/icons/ri-delete-bin-line.vue";
import RiArrowUpLine from "vue-remix-icons/icons/ri-arrow-up-line.vue";
import RiArrowDownLine from "vue-remix-icons/icons/ri-arrow-down-line.vue";
import { useAppStore } from "@/stores/app.store";
import RiCheckboxBlankFill from "vue-remix-icons/icons/ri-checkbox-blank-fill.vue";
import RiCheckboxBlankLine from "vue-remix-icons/icons/ri-checkbox-blank-line.vue";
import RiArrowRightFill from "vue-remix-icons/icons/ri-arrow-right-fill.vue";
import RiArrowGoBack from "vue-remix-icons/icons/ri-arrow-go-back-line.vue";
const props = defineProps({
  image: String,
  name: String
});
defineEmits(["back"]);

const loadedImage = ref<string | undefined>(undefined);
type AnnotationType = "text" | "box" | "emptyBox" | "arrow";
type AnnotationProperties =
  | {
      width: number;
      height: number;
    }
  | {
      font: string;
    }
  | null;
const annotations = ref<
  {
    value: string | number;
    top: number;
    left: number;
    size: number;
    color: string;
    type: AnnotationType;
    id: string;
    properties: AnnotationProperties;
  }[]
>([]);
const canvas = ref<HTMLCanvasElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);

const canvasWidth = computed(() =>
  imageRef.value ? imageRef.value!.clientWidth : 0
);
const canvasHeight = computed(() =>
  imageRef.value ? imageRef.value!.clientHeight : 0
);
const mouseOverAction = ref("");
const renderMode = ref(false);
const editor = ref<HTMLElement | null>(null);
import domtoimage from "dom-to-image";
const fontSizes = [
  {
    name: "9px",
    value: 9
  },
  {
    name: "11px",
    value: 11
  },
  {
    name: "12px",
    value: 1.25
  },
  {
    name: "14px",
    value: 14
  },
  {
    name: "20px",
    value: 20
  },
  {
    name: "30px",
    value: 30
  },
  {
    name: "35px",
    value: 35
  },
  {
    name: "40px",
    value: 40
  },
  {
    name: "64px",
    value: 64
  },
  {
    name: "72px",
    value: 72
  },
  {
    name: "96px",
    value: 96
  },
  {
    name: "128px",
    value: 128
  }
];
const colors = [
  {
    name: "White",
    value: "#ffffff"
  },
  {
    name: "Black",
    value: "#000000"
  },
  {
    name: "Blue",
    value: "#0190ea"
  },
  {
    name: "Red",
    value: "#F44336"
  },
  {
    name: "Teal",
    value: "#009688"
  },
  {
    name: "Yellow",
    value: "#ffa000"
  }
];
const fonts = [
  {
    name: "Inter",
    value: "Inter"
  },
  {
    name: "Impact",
    value: "Impact"
  }
];

const loadImage = () => {
  loadedImage.value = props.image;
  annotations.value = [];
};

onMounted(loadImage);

watch(
  () => props.image,
  () => {
    loadImage();
  }
);

const addAnnotation = (type: AnnotationType) => {
  annotations.value.push({
    value: type === "text" ? "Your text here" : "",
    top: 50,
    left: 50,
    size: 20,
    color: "white",
    type,
    id: (Math.random() + 1).toString(36).substring(7),
    properties:
      type !== "text"
        ? {
            width: 20,
            height: 20
          }
        : {
            font: "Inter"
          }
  });
};

const isDragging = ref(false);
const startPosition = ref({ x: 0, y: 0 });
const dragId = ref("");

const move = (index: number, annotation: any) => {
  const find = annotations.value.indexOf(annotation);
  annotations.value.splice(find, 1);
  annotations.value.splice(index, 0, annotation);
};

const forceSize = (id: string) => {
  const input = document.getElementById(`editor-input-${id}`);
  const annotation = annotations.value.find(
    (annotation) => annotation.id === id
  );
  if (!annotation) return;
  if (annotation.type !== "text") {
    annotation.properties!!.height = <number>input?.offsetHeight;
    annotation.properties!!.width = <number>input?.offsetWidth;
  }
};

const dragAnnotation = (id: string, deltaX: number, deltaY: number) => {
  const annotation = annotations.value.find((val) => val.id === id);
  if (!annotation) return;
  const newTop = annotation.top + deltaY;
  const newLeft = annotation.left + deltaX;

  // Define boundaries
  const minX = 0; // Minimum left boundary
  const minY = 0; // Minimum top boundary
  const input = document.getElementById(`editor-input-${id}`);
  if (annotation.type !== "text") {
    annotation.properties!!.height = <number>input?.offsetHeight;
    annotation.properties!!.width = <number>input?.offsetWidth;
  }
  const maxX = canvasWidth.value - <number>input?.clientWidth; // Maximum right boundary
  const maxY = canvasHeight.value - annotation.size; // Maximum bottom boundary

  if (newLeft >= minX && newTop >= minY && newLeft <= maxX && newTop <= maxY) {
    // Update the position if it's within bounds
    annotation.top = newTop;
    annotation.left = newLeft;
  }
};

const startDrag = (id: string, event: MouseEvent) => {
  isDragging.value = true;
  startPosition.value = { x: event.clientX, y: event.clientY };
  dragId.value = id; // Add this line to store the current index being dragged

  // Add a global event listener to track mouse movement
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);
};

const handleDrag = (event: MouseEvent) => {
  if (isDragging.value) {
    const deltaX = event.clientX - startPosition.value.x;
    const deltaY = event.clientY - startPosition.value.y;

    // Update the position of the dragged element
    dragAnnotation(dragId.value, deltaX, deltaY);

    startPosition.value = { x: event.clientX, y: event.clientY };
  }
};

const stopDrag = () => {
  isDragging.value = false;

  // Remove the global event listeners
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);

  // Restore text selection
  document.body.style.userSelect = "auto";
};

const appStore = useAppStore();

const drawAnnotations = async (
  download: boolean = false,
  test: boolean = false
) => {
  renderMode.value = true;
  await nextTick();
  const element = document.getElementById("image-editor");
  const blob = await domtoimage.toBlob(element);
  renderMode.value = false;
  if (test) {
    const testEl = document.getElementById("test-editor-render");
    if (testEl) testEl.parentNode?.removeChild(testEl);
    await nextTick();
    const el = document.createElement("img");
    el.setAttribute("src", URL.createObjectURL(blob));
    el.setAttribute("id", "test-editor-render");
    const testSpace = document.getElementById("test-space");
    return testSpace?.appendChild(el);
  }
  if (!blob) return;
  const file = new File([blob], `edited-${props.name?.split(".")[0]}.png`, {
    type: "image/png"
  });
  appStore.dialogs.gallery.upload.files.push(file);
  appStore.upload();

  /* if (canvas.value) {
    const ctx = canvas.value.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.src = loadedImage.value;
    img.setAttribute("crossorigin", "anonymous");
    img.onload = () => {
      console.log("loaded img");
      canvas.value!.width = 500;
      canvas.value!.height = 300;

      ctx.drawImage(img, 0, 0, canvas.value!.width, canvas.value!.height);
      if (exportImage) {
        annotations.value.forEach((text) => {
          const element = document.getElementById("image-editor");
          if (!element) return;
          const scaleWidth = img.width / element.offsetWidth;
          const scaleHeight = img.height / element.offsetHeight;
          const scaleFactor = Math.min(scaleWidth, scaleHeight);

          const stdFontSize = text.fontSize * scaleFactor;
          const fontSize = stdFontSize * (element.offsetWidth / img.width);

          ctx.font = `${fontSize}rem Inter`;
          ctx.fillStyle = "white";
          ctx.fillText(text.content, text.left, text.top + 15);
        });
        if (renderOnly) return;
        const dataURL = canvas.value!.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "edited_image.png";
        link.click();
      }
    };
  }*/
};

const saveImage = () => {
  if (canvas.value) {
    drawAnnotations(true);
  }
};
</script>

<style>
.arrow {
  position: relative;
  width: 0;
  height: 0;
}

.stem {
  width: 5px; /* Width of the stem */
  height: 100px; /* Length of the stem */
  background-color: #333; /* Stem color */
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.arrowhead {
  width: 0;
  height: 0;
  border-left: 15px solid transparent; /* Arrowhead width and color */
  border-right: 15px solid transparent; /* Arrowhead width and color */
  border-bottom: 25px solid; /* Arrowhead height and color */
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
