<template>
  <card class="rounded-lg shadow" secondary>
    <div @click="_expanded = !_expanded" class="cursor-pointer p-4">
      <div class="flex items-center justify-between select-none">
        <h3 class="text-lg font-semibold" v-memo="[$slots.header]">
          <slot name="header" />
        </h3>
        <RiArrowDownLine
          :class="{ 'rotate-180': expanded }"
          class="fas fa-chevron-down text-gray-600 transition-transform transform"
          style="width: 20px"
        ></RiArrowDownLine>
      </div>
    </div>
    <div
      :class="{ 'expanded-show': _expanded, 'expanded-collapse': !_expanded }"
      ref="expandContent"
      class="expansion-card break-all m-4"
    >
      <div ref="innerContent">
        <slot></slot>
      </div>
    </div>
  </card>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import Card from "@/components/Framework/Card/Card.vue";
import RiArrowDownLine from "vue-remix-icons/icons/ri-arrow-down-line.vue";
const props = defineProps({
  expanded: {
    type: Boolean,
    default: false
  }
});

const _expanded = ref(false);
const expandContent = ref<Element | null>(null);
const innerContent = ref<Element | null>(null);
let resizeObserver: ResizeObserver | null = null;
const height = ref("0px");
const emit = defineEmits(["update:expanded"]);

onMounted(() => {
  _expanded.value = props.expanded;
  height.value = expandContent.value?.scrollHeight + "px";
  resizeObserver = new ResizeObserver(() => {
    height.value = expandContent.value?.scrollHeight + "px";
  });
  resizeObserver.observe(innerContent.value!!);
});

watch(
  () => _expanded.value,
  (value) => {
    emit("update:expanded", value);
  }
);

watch(
  () => props.expanded,
  (value) => {
    _expanded.value = value;
  }
);

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<style scoped>
.expanded-show {
  height: v-bind(height);
  transition: all 0.1s;
}
.expanded-collapse {
  transition: all 0.1s;
  opacity: 0;
  visibility: hidden;
  height: 0;
  padding: 0;
  margin: -6px;
}
</style>
