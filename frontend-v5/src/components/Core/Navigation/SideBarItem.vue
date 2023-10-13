<script setup lang="ts">
import type { NavigationOption } from "@/stores/app.store";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  highlighted: Boolean,
  item: Object as () => NavigationOption
});

const router = useRouter();

const selected = computed(() => {
  return useRoute().path === props.item?.path;
});
</script>

<template>
  <div
    class="rounded-2xl hover:bg-outline-dark cursor-pointer p-2"
    :class="{
      'bg-outline-dark': selected || props.highlighted,
      'rounded-full': props.highlighted
    }"
    v-if="item"
    @click="!selected ? router.push(item.path) : () => {}"
    v-wave
  >
    <component
      :is="selected && item.selectedIcon ? item.selectedIcon : item.icon"
      class="w-7 ml-2"
    />
    <p class="ml-4 select-none">
      {{ item.name }}
    </p>
  </div>
</template>

<style scoped></style>
