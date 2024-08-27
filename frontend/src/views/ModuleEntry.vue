<template>
  <div>
    <div
      style="z-index: 0"
      class="d-flex justify-center flex-column align-center w-full position-absolute h-full"
      v-if="!rendered"
    >
      <FlowinityLogoAnimated
        style="width: 96px"
        :skip-init="true"
        :animate="true"
      />
      <p class="text-center text-medium-emphasis text-h4 mt-4">Flowinity</p>
      <p class="text-center text-medium-emphasis text-h6">{{ id }}</p>
    </div>
    <div :id="id" ref="module" style="z-index: 2"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import { useModulesStore } from "@/store/modules.store";
import FlowinityLogoAnimated from "@/components/Brand/FlowinityLogoAnimated.vue";

const modulesStore = useModulesStore();

const rendered = ref(false);
const module = ref<HTMLElement | null>(null);

const props = defineProps({
  id: String
});

onMounted(() => {
  modulesStore.mount("FlowForms");
  // check every 50ms
  // TODO: find a better way to detect if the module is rendered
  const interval = setInterval(() => {
    if (module.value?.children.length) {
      clearInterval(interval);
      rendered.value = true;
    }
  }, 50);
});
</script>
<style scoped></style>
