<template>
  <div
    style="min-height: 64px; max-height: 64px"
    id="appbar"
    :class="navbarClasses"
    v-tooltip.bottom="markRaw(MeetActionBar)"
    class="z-50"
  >
    <div
      class="flex p-4 justify-items-end h-full justify-between z-50"
      :class="{ 'items-center': !expanded, 'items-end': expanded }"
      :style="{ 'max-height: 63px; min-height: 63px': !expanded }"
    >
      <div class="flex select-none">
        <div class="max-sm:block hidden">
          <tpu-button
            color="white"
            :icon="true"
            variant="passive"
            class="mr-2"
            @click="appStore.drawer = !appStore.drawer"
            v-if="userStore.user"
          >
            <RiMenuLine style="width: 20px" />
          </tpu-button>
        </div>
        <Transition mode="out-in" name="slide-up">
          <div
            class="flex"
            :class="{ 'items-center': !expanded, 'items-end': expanded }"
            :key="appStore.currentNavItem?.rail?.id"
            v-memo="[
              appStore.currentRail?.name,
              appStore.currentNavItem?.rail?.id
            ]"
            v-if="appStore.currentNavItem?.rail?.name"
          >
            <div class="flex items-center">
              <router-link
                :to="appStore.currentNavItem?.rail.path"
                class="cursor-pointer flex items-center"
              >
                <component
                  :is="appStore.currentNavItem?.rail?.icon"
                  class="w-8 mr-2 fill-medium-emphasis-dark"
                  v-if="appStore.currentNavItem?.rail?.icon"
                />
                <span class="text-medium-emphasis-dark">
                  {{ appStore.currentNavItem?.rail?.name }}
                </span>
              </router-link>
              <RiArrowRightSLine class="w-6 mx-3 fill-medium-emphasis-dark" />
            </div>
          </div>
        </Transition>
        <Transition mode="out-in" name="slide-up">
          <div
            class="flex"
            :class="{ 'items-center': !expanded, 'items-end': expanded }"
            :key="appStore.currentNavItem?.item"
            v-memo="[
              appStore.currentNavItem?.item?.name,
              appStore.currentNavItem?.rail?.id
            ]"
          >
            <div class="items-center flex">
              <component
                :is="appStore.currentNavItem?.item.icon"
                class="w-8 mr-2 items-center fill-white"
                v-if="appStore.currentNavItem?.item.icon"
              />
              {{ appStore.currentNavItem?.item.name || "Flowinity" }}
            </div>
          </div>
        </Transition>
      </div>
      <VDropdown
        :distance="6"
        :triggers="[]"
        :shown="appStore.dialogs.tutorials.actionBar.value"
        class="flex"
      >
        <div
          id="appbar-options-first"
          class="flex gap-2 mr-2"
          :class="{ 'items-center': !expanded, 'items-end': expanded }"
        />
        <div
          id="appbar-options"
          class="flex gap-2"
          :class="{ 'items-center': !expanded, 'items-end': expanded }"
        />

        <template #popper>
          <meet-action-bar />
        </template>
      </VDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app.store";
import RiArrowRightSLine from "vue-remix-icons/icons/ri-arrow-right-s-line.vue";
import RiMenuLine from "vue-remix-icons/icons/ri-menu-line.vue";
import TpuButton from "@/components/Core/Button/TpuButton.vue";
import { useUserStore } from "@/stores/user.store";
import { computed, ref, watch, markRaw } from "vue";
import { debounce } from "lodash";
import MeetActionBar from "@/components/Tutorials/MeetActionBar.vue";

const appStore = useAppStore();
const userStore = useUserStore();
const image = computed(() => {
  return appStore.appBarImage ? `url(${appStore.appBarImage})` : undefined;
});
const scrolled = ref(false);
const navbarClasses: Record<any, any> = ref({
  "border-b-2 w-full dark:border-outline-dark dark:bg-dark backdrop-blur-lg sticky top-0 z-50 overflow-clip no-image":
    true
});
const expanded = ref(false);
const handleScroll = () => {
  const hasImage = !!image.value;
  scrolled.value = appStore.scrollPosition > 1;
  navbarClasses.value = {
    "border-b-2 w-full dark:border-outline-dark dark:bg-dark backdrop-blur-lg sticky top-0 z-50 overflow-clip":
      true,
    "has-image expanded": hasImage && !scrolled.value,
    "has-image collapsed": hasImage && scrolled.value,
    "no-image collapsed": !hasImage
  };
  expanded.value = hasImage && !scrolled.value;
};
// Define a debounce function with a 200ms delay (adjust as needed)
const debouncedHandleScroll = debounce(handleScroll, 10);
watch(
  () => image.value,
  () => {
    handleScroll();
  }
);
document.addEventListener("touchstart", () => {
  debouncedHandleScroll();
});
document.addEventListener("wheel", () => {
  debouncedHandleScroll();
});
</script>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.1s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.has-image::before {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    v-bind(image);
  background-size: cover;
  position: absolute;
  top: 0px;
  left: 0px;
  content: "";
  width: 100%;
  height: 360px;
  z-index: -1;
}

.expanded {
  min-height: 200px !important;
  max-height: 200px !important;
}

.collapsed {
  min-height: 64px !important;
  max-height: 64px !important;
}

.has-image,
.no-image {
  transition:
    min-height 0.2s ease,
    max-height 0.2s ease;
}
</style>
