<template>
  <div
    class="border-b-2 w-full dark:border-outline-dark dark:bg-dark backdrop-blur-lg sticky top-0 z-40 overflow-clip"
    style="min-height: 64px; max-height: 64px"
    id="appbar"
    :class="{ 'has-image': image }"
  >
    <span
      class="flex items-center p-4 justify-items-center h-full justify-between z-50"
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
            class="flex items-center"
            :key="appStore.currentNavItem?.rail?.id"
            v-if="appStore.currentNavItem?.rail?.name"
          >
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
        </Transition>
        <Transition mode="out-in" name="slide-up">
          <span class="flex items-center" :key="appStore.currentNavItem?.item">
            <component
              :is="appStore.currentNavItem?.item.icon"
              class="w-8 mr-2"
              v-if="appStore.currentNavItem?.item.icon"
            />
            {{ appStore.currentNavItem?.item.name || "Flowinity" }}
          </span>
        </Transition>
      </div>
      <div id="appbar-options" class="flex gap-2" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app.store";
import RiArrowRightSLine from "vue-remix-icons/icons/ri-arrow-right-s-line.vue";
import RiMenuLine from "vue-remix-icons/icons/ri-menu-line.vue";
import TpuImg from "@/components/Core/Image/TpuImg.vue";
import TpuButton from "@/components/Core/Button/TpuButton.vue";
import { useUserStore } from "@/stores/user.store";
import { computed } from "vue";

const appStore = useAppStore();
const userStore = useUserStore();
const image = computed(() => {
  return appStore.appBarImage ? `url(${appStore.appBarImage})` : undefined;
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
  height: 64px;
  z-index: -1;
  filter: blur(10px);
}
</style>
