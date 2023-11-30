<template>
  <div class="pager flex flex-wrap justify-center gap-4">
    <tpu-button
      :disabled="props.modelValue <= 1"
      icon
      class="px-3"
      variant="passive"
      @click="$emit('update:modelValue', props.modelValue - 1)"
    >
      <RiArrowLeftSLine style="width: 20px"></RiArrowLeftSLine>
    </tpu-button>
    <template v-if="totalPages">
      <template v-if="!pages.includes(1)">
        <tpu-button
          icon
          class="rounded-full px-4"
          variant="passive"
          @click="$emit('update:modelValue', 1)"
        >
          1
        </tpu-button>
        <template v-if="!left.value">
          <tpu-button
            icon
            class="rounded-full px-4"
            variant="passive"
            @click="left.value = true"
          >
            ...
          </tpu-button>
        </template>
        <template v-else>
          <text-field
            v-model="left.content"
            parent-style="margin: 0"
            style="width: 40px; height: 40px"
            type="number"
            min="1"
            autofocus
            @keydown.enter="
              $emit('update:modelValue', parseInt(left.content));
              left.value = false;
            "
            @blur="
              left.value = false;
              left.content = '';
            "
            @keydown.esc="
              left.value = false;
              left.content = '';
            "
          />
        </template>
      </template>
      <tpu-button
        v-for="page in pages"
        :key="page"
        icon
        class="flex justify-center"
        style="min-width: 40px; min-height: 40px"
        :selected="page === modelValue"
        variant="passive"
        color="white"
        @click="$emit('update:modelValue', page)"
      >
        {{ page }}
      </tpu-button>
      <template v-if="!pages.includes(totalPages)">
        <template v-if="!right.value">
          <tpu-button
            icon
            class="rounded-full px-4"
            variant="passive"
            @click="right.value = true"
          >
            ...
          </tpu-button>
        </template>
        <template v-else>
          <text-field
            v-model="right.content"
            parent-style="margin: 0"
            min="1"
            style="width: 40px; height: 40px"
            type="number"
            autofocus
            @keydown.enter="
              $emit('update:modelValue', parseInt(right.content));
              right.value = false;
            "
            @blur="
              right.value = false;
              right.content = '';
            "
            @keydown.esc="
              right.value = false;
              right.content = '';
            "
          />
        </template>
        <tpu-button
          icon
          variant="passive"
          class="flex justify-center"
          style="min-width: 40px; min-height: 40px"
          @click="$emit('update:modelValue', totalPages)"
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
import { computed, ref } from "vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiArrowLeftSLine from "vue-remix-icons/icons/ri-arrow-left-s-line.vue";
import RiArrowRightSLine from "vue-remix-icons/icons/ri-arrow-right-s-line.vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import { isNumeric } from "@/plugins/isNumeric";

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
const left = ref({
  content: "",
  value: false
});
const right = ref({
  content: "",
  value: false
});

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
