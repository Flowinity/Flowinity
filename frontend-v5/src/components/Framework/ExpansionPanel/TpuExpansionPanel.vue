<template>
  <card class="rounded-lg shadow" secondary>
    <div class="cursor-pointer p-4" @click="expanded = !expanded">
      <div class="flex items-center justify-between select-none">
        <h3 v-memo="[$slots.header]" class="text-lg font-semibold">
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
      ref="expandContent"
      :class="{ 'expanded-show': expanded, 'expanded-collapse': !expanded }"
      class="expansion-card break-all m-4"
    >
      <div ref="innerContent">
        <slot></slot>
      </div>
    </div>
  </card>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import Card from "@/components/Framework/Card/Card.vue";
import RiArrowDownLine from "vue-remix-icons/icons/ri-arrow-down-line.vue";
const expanded = ref(false);
const expandContent = ref<Element | null>(null);
const innerContent = ref<Element | null>(null);
let resizeObserver: ResizeObserver | null = null;
const height = ref("0px");

onMounted(() => {
  height.value = expandContent.value?.scrollHeight + "px";
  resizeObserver = new ResizeObserver(() => {
    height.value = expandContent.value?.scrollHeight + "px";
  });
  resizeObserver.observe(innerContent.value!!);
});

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
