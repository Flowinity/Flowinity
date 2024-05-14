<script setup lang="ts">
import type { NavigationOption } from "@/store/progressive.store";
import { computed, useAttrs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store/app.store";
import { useDisplay } from "vuetify";

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
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const appStore = useAppStore();
const router = useRouter();
const route = useRoute();
const attrs = useAttrs();
const display = useDisplay();

const selected = computed(() => {
  return props.selected || route?.path === (props.item?.path || props.to);
});

function handleClick() {
  if (props.disabled) {
    return;
  } else {
    if (attrs["onClick"]) {
      // @ts-ignore
      attrs["onClick"]();
    }

    if (!props.selected) {
      if (props.item?.click) {
        props.item?.click();
      } else {
        router.push(props.item?.path || props.to || "");
      }
    }

    if (props.closeOnClick && display.mobile.value) {
      appStore.mainDrawer = false;
    }
  }
}
</script>

<template>
  <div>
    <component
      :is="disabled ? 'div' : 'a'"
      :href="item?.path || to"
      class="w-full text-white"
      @click.prevent.stop
      tabindex="-1"
    >
      <div
        class="rounded-2xl hover:bg-outline-dark cursor-pointer p-2 flex items-center h-full w-full dark:fill-white"
        :class="{
          'bg-outline-dark': selected || props.highlighted,
          'rounded-full': props.highlighted,
          'cursor-not-allowed opacity-50': props.disabled
        }"
        @click.prevent.stop="handleClick"
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
        <template v-if="item?.selectedIcon || item?.icon">
          <component
            :is="selected && item.selectedIcon ? item.selectedIcon : item.icon"
            class="w-7 ml-2"
            style="min-width: 24px"
          />
        </template>
        <template v-else>
          <div class="flex">
            <slot name="icon" />
          </div>
        </template>
        <div class="ml-4 select-none flex justify-between w-full">
          <div>
            <template v-if="item?.name">
              {{ item.name }}
              <template v-if="item?.badge">
                <v-chip size="x-small" class="ml-1">
                  {{ item.badge }}
                </v-chip>
              </template>
            </template>
            <template v-else>
              <slot name="title" />
            </template>
            <div class="text-medium-emphasis-dark">
              <slot name="subtitle" />
            </div>
          </div>
          <!-- append slot -->
          <div>
            <slot name="append" />
          </div>
        </div>
      </div>
    </component>
  </div>
</template>

<style scoped></style>
