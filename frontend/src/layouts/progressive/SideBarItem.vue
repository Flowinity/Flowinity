<script setup lang="ts">
import type { NavigationOption } from "@/store/progressive.store";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store/app.store";

const props = defineProps({
  highlighted: Boolean,
  item: [Object as () => NavigationOption, undefined],
  to: [String, undefined],
  closeOnClick: {
    type: Boolean,
    default: true
  },
  selected: {
    type: Boolean,
    default: false
  }
});

const appStore = useAppStore();
const router = useRouter();
const route = useRoute();

const selected = computed(() => {
  return props.selected || route?.path === (props.item?.path || props.to);
});
</script>

<template>
  <div>
    <a
      :href="item?.path || to"
      class="w-full text-white"
      @click.prevent.stop
      tabindex="-1"
    >
      <div
        class="rounded-2xl hover:bg-outline-dark cursor-pointer p-2 flex items-center h-full w-full dark:fill-white"
        :class="{
          'bg-outline-dark': selected || props.highlighted,
          'rounded-full': props.highlighted
        }"
        @click.prevent.stop="
          //@ts-ignore
          $attrs['onClick'] && $attrs['onClick']();
          !selected ? router.push(item?.path || to) : () => {};
          props.closeOnClick && $vuetify.display.mobile
            ? (appStore.mainDrawer = false)
            : () => {};
        "
        v-ripple
        tabindex="0"
        @keydown.enter="
          //@ts-ignore
          $event.target?.click()
        "
        v-bind="$attrs"
        @keydown.space="
          $event.preventDefault();
          //@ts-ignore
          $event.target?.click();
        "
      >
        <slot />
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
        <div class="ml-4 select-none truncate">
          <template v-if="item?.name">
            {{ item.name }}
            <template v-if="item?.badge">
              <v-badge class="ml-2">
                {{ item.badge }}
              </v-badge>
            </template>
          </template>
          <template v-else>
            <slot name="title" />
          </template>
          <div class="text-medium-emphasis-dark">
            <slot name="subtitle" />
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<style scoped></style>
