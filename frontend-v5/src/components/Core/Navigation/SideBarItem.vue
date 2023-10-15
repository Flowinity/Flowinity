<script setup lang="ts">
import type { NavigationOption } from "@/stores/app.store";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import TpuBadge from "@/components/Core/Badge/TpuBadge.vue";
import { useAppStore } from "@/stores/app.store";

const props = defineProps({
  highlighted: Boolean,
  item: [Object as () => NavigationOption, undefined],
  to: [String, undefined],
  closeOnClick: {
    type: Boolean,
    default: true
  }
});

const appStore = useAppStore();
const router = useRouter();

const selected = computed(() => {
  return useRoute().path === (props.item?.path || props.to);
});
</script>

<template>
  <div
    class="rounded-2xl hover:bg-outline-dark cursor-pointer p-2 flex items-center h-full"
    :class="{
      'bg-outline-dark': selected || props.highlighted,
      'rounded-full': props.highlighted
    }"
    @click="
      props.closeOnClick ? (appStore.drawer = false) : () => {};
      !selected ? router.push(item?.path || to) : () => {};
    "
    v-wave
  >
    <template v-if="item?.selectedIcon && item.icon">
      <component
        :is="selected && item.selectedIcon ? item.selectedIcon : item.icon"
        class="w-7 ml-2"
      />
    </template>
    <template v-else>
      <div class="flex">
        <slot name="icon" />
      </div>
    </template>
    <p class="ml-4 select-none truncate">
      <template v-if="item?.name">
        {{ item.name }}
      </template>
      <template v-else>
        <slot name="title" />
      </template>
      <template v-if="item?.badge">
        <tpu-badge class="ml-2">
          {{ item.badge }}
        </tpu-badge>
      </template>
    </p>
  </div>
</template>

<style scoped></style>
