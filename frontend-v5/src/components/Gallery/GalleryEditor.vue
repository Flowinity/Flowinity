<template>
  <div class="flex flex-col items-center">
    editor - {{ canvasWidth }} / {{ canvasHeight }}
    <div class="relative mt-4">
      <canvas
        ref="canvas"
        :width="canvasWidth"
        :height="canvasHeight"
        style="width: 100%"
      ></canvas>
      <div
        v-for="(text, index) in annotations"
        :key="index"
        class="absolute text-xl text-white"
        :style="{ top: text.top + 'px', left: text.left + 'px' }"
        @click="editAnnotation(index)"
        @drag="dragAnnotation(index, $event)"
      >
        <VDropdown
          :triggers="['hover']"
          placement="top-start"
          class="flex items-center"
        >
          <text-field
            style="border-bottom: none; margin-top: 0; margin-bottom: 0"
            :style="{ 'font-size': text.fontSize + 'px' }"
            v-model="text.content"
          />
          <template #popper>
            <card>
              <Transition mode="out-in" name="slide-up" appear>
                <div class="fill-white">
                  <VDropdown
                    :triggers="['click']"
                    placement="right"
                    class="flex items-center"
                    @mouseover="mouseOverAction = index"
                  >
                    <tpu-button variant="passive">
                      <RiFontSize style="width: 20px" />
                    </tpu-button>
                    <template #popper>
                      <card :padding="false" class="py-1">
                        <tpu-list>
                          <tpu-list-item
                            v-for="size in fontSizes"
                            @click="text.fontSize = size.value"
                            :key="size.value"
                          >
                            {{ size.name }}
                          </tpu-list-item>
                        </tpu-list>
                      </card>
                    </template>
                  </VDropdown>
                </div>
              </Transition>
            </card>
          </template>
        </VDropdown>
      </div>
    </div>
  </div>
  <tpu-button @click="addAnnotation">Add Text</tpu-button>
  <tpu-button @click="saveImage">Save Image</tpu-button>
  <tpu-button @click="drawAnnotations(true, true)">Render in canvas</tpu-button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUpdated, watch } from "vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import Card from "@/components/Framework/Card/Card.vue";
import RiFontSize from "vue-remix-icons/icons/ri-font-size.vue";
import TpuOverline from "@/components/Framework/Typography/TpuOverline.vue";
import TpuList from "@/components/Framework/List/TpuList.vue";
import TpuListItem from "@/components/Framework/List/TpuListItem.vue";
const props = defineProps({
  image: String
});

const loadedImage = ref<string | undefined>(undefined);
const annotations = ref<
  { content: string; top: number; left: number; fontSize: number }[]
>([]);
const editingIndex = ref<number | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const canvasWidth = computed(() => (canvas.value ? canvas.value.width : 0));
const canvasHeight = computed(() => (canvas.value ? canvas.value.height : 0));
const mouseOverAction = ref(-1);
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
    name: "14px",
    value: 14
  },
  {
    name: "20px",
    value: 20
  },
  {
    name: "25px",
    value: 25
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

const loadImage = () => {
  loadedImage.value = props.image;
  annotations.value = [];
  editingIndex.value = null;
  drawAnnotations();
};

onMounted(loadImage);

watch(
  () => props.image,
  () => {
    loadImage();
  }
);

const addAnnotation = () => {
  annotations.value.push({
    content: "Your text here",
    top: 50,
    left: 50,
    fontSize: 20
  });
  drawAnnotations();
};

const editAnnotation = (index) => {
  editingIndex.value = index;
};

const dragAnnotation = (index, event) => {
  console.log(event.clientX);
  const rect = canvas.value?.getBoundingClientRect();
  if (canvas.value) {
    annotations.value[index].top = event.clientY - rect!.top;
    annotations.value[index].left = event.clientX - rect!.left;
  }
};

const drawAnnotations = (
  exportImage: boolean = false,
  renderOnly: boolean = false
) => {
  if (canvas.value) {
    const ctx = canvas.value.getContext("2d");
    if (!ctx) return;
    ctx!.clearRect(0, 0, canvas.value.width, canvas.value.height);
    const img = new Image();
    img.src = loadedImage.value;
    img.setAttribute("crossorigin", "anonymous");
    img.onload = () => {
      console.log("loaded img");
      canvas.value!.width = img.width;
      canvas.value!.height = img.height;
      console.log(img.width, img.height);
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
      if (exportImage) {
        annotations.value.forEach((text) => {
          ctx.font = `${text.fontSize}px Inter`;
          ctx.fillStyle = "white";
          ctx.fillText(text.content, text.left, text.top + 30);
        });
        if (renderOnly) return;
        const dataURL = canvas.value!.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "edited_image.png";
        link.click();
      }
    };
  }
};

const saveImage = () => {
  if (canvas.value) {
    drawAnnotations(true);
  }
};
</script>
