<template>
  <div class="pager flex flex-wrap justify-center gap-4 mb-5">
    <tpu-button
      :disabled="props.modelValue === 1"
      icon
      class="px-3"
      variant="passive"
    >
      <RiArrowLeftSLine style="width: 20px"></RiArrowLeftSLine>
    </tpu-button>
    <template v-if="totalPages">
      <template v-if="!pages.includes(1)">
        <tpu-button icon class="rounded-full px-4">1</tpu-button>
        <tpu-button icon class="rounded-full px-4">...</tpu-button>
      </template>
      <tpu-button
        icon
        class="flex justify-center"
        style="min-width: 40px; min-height: 40px"
        v-for="page in pages"
        :key="page"
        :selected="page === modelValue"
        variant="passive"
        color="white"
        @click="$emit('update:modelValue', page)"
      >
        {{ page }}
      </tpu-button>
      <template v-if="!pages.includes(totalPages)">
        <tpu-button icon class="rounded-full px-4" variant="passive">
          ...
        </tpu-button>
        <tpu-button
          icon
          variant="passive"
          class="flex justify-center"
          style="min-width: 40px; min-height: 40px"
        >
          {{ totalPages }}
        </tpu-button>
      </template>
      <tpu-button
        :disabled="props.modelValue === totalPages"
        icon
        class="px-3"
        variant="passive"
        @click="$emit('update:modelValue', props.modelValue + 1)"
      >
        <RiArrowRightSLine style="width: 20px"></RiArrowRightSLine>
      </tpu-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TpuButton from "@/components/Core/Button/TpuButton.vue";
import RiArrowLeftSLine from "vue-remix-icons/icons/ri-arrow-left-s-line.vue";
import RiArrowRightSLine from "vue-remix-icons/icons/ri-arrow-right-s-line.vue";

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number as () => number | null | undefined,
    required: false,
    default: 1
  },
  maxVisible: {
    type: Number,
    default: 15
  }
});
defineEmits(["update:modelValue"]);
const maxVisibleResponsive = 10;

const pages = computed(() => {
  let startPage = Math.max(
    props.modelValue - Math.floor(maxVisibleResponsive / 2),
    1
  );
  let endPage = Math.min(
    startPage + maxVisibleResponsive - 1,
    props.totalPages || 1
  );

  const visiblePagesCount = endPage - startPage + 1;
  if (visiblePagesCount < maxVisibleResponsive) {
    if (startPage === 1) {
      endPage = Math.min(props.totalPages || 1, maxVisibleResponsive);
    } else {
      startPage = Math.max(1, endPage - maxVisibleResponsive + 1);
    }
  }

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return visiblePages;
});
</script>

<style scoped></style>
