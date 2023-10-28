<template>
  <div
    style="min-height: 64px; max-height: 64px; z-index: 49"
    id="appbar"
    :class="navbarClasses"
    v-tooltip.bottom="markRaw(MeetActionBar)"
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
        <Transition
          mode="out-in"
          name="slide-up"
          v-for="(rail, index) in appStore.currentNavItem?.rail"
        >
          <div
            class="flex max-sm:hidden"
            :class="{ 'items-center': !expanded, 'items-end': expanded }"
            v-if="rail.name"
            :key="rail.id"
          >
            <div class="flex items-center">
              <router-link
                :to="rail.path"
                @click="
                  rail?.fake ? () => {} : (appStore.navigation.mode = rail?.id)
                "
                class="cursor-pointer flex items-center"
              >
                <component
                  :is="rail?.icon"
                  class="w-8"
                  v-if="rail?.icon"
                  :class="
                    appStore.currentNavItem?.item?.path ===
                    appStore.currentNavItem?.rail[0]?.path
                      ? 'fill-white'
                      : 'fill-medium-emphasis-dark'
                  "
                />
                <span
                  style="margin: 0px 0px 0px 8px"
                  :class="
                    appStore.currentNavItem?.item?.path ===
                    appStore.currentNavItem?.rail[0]?.path
                      ? 'text-white'
                      : 'text-medium-emphasis-dark'
                  "
                >
                  {{ rail.name }}
                </span>
              </router-link>
              <RiArrowRightSLine
                v-if="appStore.currentNavItem?.rail?.length - 1 !== index"
                class="w-6 fill-medium-emphasis-dark items-center"
                v-memo="[]"
                style="margin: 0px 4px 0px 4px"
              />
            </div>
          </div>
        </Transition>
        <Transition mode="out-in" name="slide-up">
          <div
            v-if="
              appStore.currentNavItem?.item?.path !==
              appStore.currentNavItem?.rail[0]?.path
            "
            class="flex"
            :key="appStore.currentNavItem?.item"
            v-memo="[
              appStore.currentNavItem?.item?.name,
              appStore.currentNavItem?.rail?.id
            ]"
          >
            <RiArrowRightSLine
              v-if="
                appStore.currentNavItem?.item?.path !==
                appStore.currentNavItem?.rail[0]?.path
              "
              class="w-6 fill-medium-emphasis-dark items-center"
              v-memo="[]"
              style="margin: 0px 4px 0px 4px"
            />
            <div class="items-center flex">
              <div>
                <component
                  :is="appStore.currentNavItem?.item.icon"
                  class="w-8 fill-white"
                  v-if="appStore.currentNavItem?.item.icon"
                />
              </div>

              <div style="padding-left: 8px">
                {{
                  appStore.currentNavItem?.item.name ||
                  route.name ||
                  "Flowinity"
                }}
              </div>
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
          class="flex gap-2 mr-2"
          :class="{ 'items-center': !expanded, 'items-end': expanded }"
          v-if="appStore.dialogs.gallery.upload.loading"
        >
          <tpu-spinner
            :percentage="appStore.dialogs.gallery.upload.percentage"
            size="35"
            v-tooltip.bottom="
              appStore.dialogs.gallery.upload.files
                .map((file: File) => file.name)
                .join(', ')
            "
          >
            <p style="font-size: 9px">
              {{ appStore.dialogs.gallery.upload.percentage }}%
            </p>
          </tpu-spinner>
        </div>
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
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { useUserStore } from "@/stores/user.store";
import { computed, ref, watch, markRaw } from "vue";
import { debounce } from "lodash";
import MeetActionBar from "@/components/Tutorials/MeetActionBar.vue";
import TpuSpinner from "@/components/Framework/Spinner/TpuSpinner.vue";
import { useRoute } from "vue-router";

const appStore = useAppStore();
const userStore = useUserStore();
const image = computed(() => {
  console.log(appStore.appBarImage);
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
const route = useRoute();
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
