<template>
  <card
    class="cursor-progress max-w-sm rounded shadow animate-pulse w-full"
    role="status"
    :padding="false"
  >
    <template v-for="(type, index) in types" :key="index">
      <template v-if="type === 'toolbar'">
        <tpu-toolbar
          class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700"
        ></tpu-toolbar>
      </template>
      <template v-else-if="type === 'image'">
        <div
          class="flex items-center justify-center my-4 bg-gray-300 rounded dark:bg-gray-700 fill-medium-emphasis-dark"
          style="max-height: 100px"
        >
          <RiImageFill style="max-width: 200px; max-height: 100px" />
        </div>
      </template>
      <template v-else-if="type === 'heading'">
        <div
          class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mb-4 mr-4"
        ></div>
      </template>
      <template v-else-if="type === 'paragraph'">
        <div
          class="h-2 bg-gray-200 rounded-full dark:bg-card-secondary-dark mb-2.5 ml-4"
          style="width: 65%"
        ></div>
      </template>
      <template v-else-if="type === 'button'">
        <div class="flex gap-2 items-center justify-center mb-2">
          <tpu-button style="width: 44px; height: 28px"></tpu-button>
          <tpu-button style="width: 44px; height: 28px"></tpu-button>
          <tpu-button style="width: 44px; height: 28px"></tpu-button>
          <tpu-button style="width: 44px; height: 28px"></tpu-button>
          <tpu-button style="width: 44px; height: 28px"></tpu-button>
          <tpu-button style="width: 44px; height: 28px"></tpu-button>
        </div>
      </template>
    </template>
  </card>
</template>

<script setup lang="ts">
import TpuToolbar from "@/components/Framework/Toolbar/TpuToolbar.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import Card from "@/components/Framework/Card/Card.vue";
import RiImageFill from "vue-remix-icons/icons/ri-image-fill.vue";
type skeletonTypes =
  | "toolbar"
  | "button"
  | "image"
  | "avatar"
  | "paragraph"
  | "heading";

const props = defineProps({
  types: {
    type: Object as () => skeletonTypes[]
  }
});
</script>

<style scoped></style>
