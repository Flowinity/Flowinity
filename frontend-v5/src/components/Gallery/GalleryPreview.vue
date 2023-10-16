<template>
  <div class="justify-center items-center flex" style="height: 150px">
    <tpu-hover v-if="props.item.type === 'image'">
      <template v-slot="{ hovering }">
        <tpu-img
          :src="appStore.domain + props.item?.attachment"
          height="150"
          class="justify-center items-center flex"
        >
          <tpu-overlay
            :href="appStore.domain + props.item?.attachment"
            target="_blank"
            component="a"
            :absolute="true"
            :model-value="hovering"
            class="z-10"
          >
            <RiExternalLinkLine style="width: 64px" class="fill-white" />
          </tpu-overlay>
        </tpu-img>
      </template>
    </tpu-hover>
    <video
      v-else-if="props.item.type === 'video'"
      controls
      class="flex"
      style="height: 150px"
    >
      <source :src="appStore.domain + props.item?.attachment" />
    </video>
    <div
      class="w-full flex items-center justify-center fill-medium-emphasis-dark text-medium-emphasis-dark"
      v-else
    >
      <RiFileLine :style="{ width: 150 + 'px' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Upload } from "@/gql/graphql";
import RiFileLine from "vue-remix-icons/icons/ri-file-line.vue";
import RiExternalLinkLine from "vue-remix-icons/icons/ri-external-link-line.vue";
import TpuImg from "@/components/Core/Image/TpuImg.vue";
import { useAppStore } from "@/stores/app.store";
import TpuSpinner from "@/components/Core/Spinner/TpuSpinner.vue";
import TpuHover from "@/components/Core/Hover/TpuHover.vue";
import TpuOverlay from "@/components/Core/Overlay/TpuOverlay.vue";

const appStore = useAppStore();
const props = defineProps({
  item: {
    type: Object as () => Upload,
    required: true
  }
});
</script>

<style scoped></style>
