<template>
  <v-app-bar
    id="appbar"
    style="min-height: 64px; max-height: 64px; z-index: 1001"
    :key="$app.activeNags.offset"
    :class="{ ...navbarClasses, ...classString }"
    :extension-height="$app.activeNags.offset"
    app
    class="navbar"
    color="dark"
    density="comfortable"
    :flat="true"
    :floating="true"
  >
    <div
      class="flex p-4 justify-items-end h-full justify-between z-50"
      :class="{ 'items-center': !expanded, 'items-end': expanded }"
      :style="{
        'max-height': expanded ? '63px' : undefined,
        'min-height': expanded ? '63px' : undefined
      }"
    >
      <div class="flex select-none">
        <div class="max-sm:block hidden">
          <v-btn
            v-if="userStore.user"
            color="white"
            :icon="true"
            class="mr-2"
            @click="appStore.mainDrawer = !appStore.mainDrawer"
          >
            <RiMenuLine style="width: 20px" />
          </v-btn>
        </div>
        <Transition
          v-for="(rail, index) in uiStore.currentNavItem?.rail"
          :key="rail.id"
          mode="out-in"
          name="slide-up"
        >
          <div
            v-if="rail.name"
            :key="rail.id"
            class="flex max-sm:hidden"
            :class="{ 'items-center': !expanded, 'items-end': expanded }"
          >
            <div class="flex items-center">
              <router-link
                :to="rail.path"
                class="cursor-pointer flex items-center"
                @click="!rail?.fake ? (uiStore.navigation.mode = rail?.id) : ''"
              >
                <component
                  :is="rail?.icon"
                  v-if="rail?.icon"
                  class="w-8"
                  :class="
                    uiStore.currentNavItem?.item?.path ===
                    uiStore.currentNavItem?.rail[0]?.path
                      ? 'fill-white'
                      : 'fill-medium-emphasis-dark'
                  "
                />
                <span
                  style="margin: 0px 0px 0px 8px"
                  :class="
                    uiStore.currentNavItem?.item?.path ===
                    uiStore.currentNavItem?.rail[0]?.path
                      ? 'text-white'
                      : 'text-medium-emphasis-dark'
                  "
                >
                  {{ rail.name }}
                </span>
              </router-link>
              <RiArrowRightSLine
                v-if="uiStore.currentNavItem?.rail?.length - 1 !== index"
                class="w-6 fill-medium-emphasis-dark items-center"
                style="margin: 0px 4px 0px 4px"
              />
            </div>
          </div>
        </Transition>
        <Transition mode="out-in" name="slide-up" appear>
          <div
            v-if="
              uiStore.currentNavItem?.item?.path !==
              uiStore.currentNavItem?.rail[0]?.path
            "
            :key="
              uiStore.currentNavItem?.item.name +
              uiStore.currentNavItem?.rail[0]?.id
            "
            v-memo="[
              uiStore.currentNavItem?.item?.name,
              uiStore.currentNavItem?.rail[0]?.id
            ]"
            class="flex"
          >
            <RiArrowRightSLine
              v-if="
                uiStore.currentNavItem?.item?.path !==
                uiStore.currentNavItem?.rail[0]?.path
              "
              v-memo="[]"
              class="w-6 fill-medium-emphasis-dark items-center"
              style="margin: 0px 4px 0px 4px"
            />
            <div class="items-center flex">
              <div>
                <component
                  :is="uiStore.currentNavItem?.item.icon"
                  v-if="uiStore.currentNavItem?.item.icon"
                  class="w-8 fill-white"
                />
              </div>

              <div style="padding-left: 8px">
                {{
                  uiStore.currentNavItem?.item.name || route.name || "Flowinity"
                }}
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <!-- TODO: Meet Action Bar -->
      <VDropdown :distance="6" :triggers="[]" :shown="false" class="flex">
        <div
          v-if="appStore.dialogs.upload.loading"
          class="flex gap-2 mr-2"
          :class="{ 'items-center': !expanded, 'items-end': expanded }"
        >
          <tpu-spinner
            v-tooltip.bottom="
              appStore.dialogs.upload.files
                .map((file: File) => file.name)
                .join(', ')
            "
            :percentage="appStore.dialogs.upload.percentage"
            size="35"
          >
            <p style="font-size: 9px">
              {{ appStore.dialogs.upload.percentage }}%
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
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app.store";
import { useProgressiveUIStore } from "@/store/progressive.store";
import { useUserStore } from "@/store/user.store";
import { computed, ref, watch, markRaw } from "vue";
import { debounce } from "lodash";
import { useRoute } from "vue-router";
import { RiArrowRightSLine, RiMenuLine } from "@remixicon/vue";
import { useDisplay } from "vuetify";
import { useChatStore } from "@/store/chat.store";

const uiStore = useProgressiveUIStore();
const userStore = useUserStore();
const appStore = useAppStore();
const chatStore = useChatStore();

const image = computed(() => {
  console.log(uiStore.appBarImage);
  return uiStore.appBarImage ? `url(${uiStore.appBarImage})` : undefined;
});
const scrolled = ref(false);
const navbarClasses: Record<any, any> = ref({
  "border-b-2 w-full dark:border-outline-dark dark:bg-dark backdrop-blur-lg sticky top-0 z-50 overflow-clip no-image":
    true
});
const expanded = ref(false);
const handleScroll = () => {
  const hasImage = !!image.value;
  scrolled.value = uiStore.scrollPosition > 1;
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
const display = useDisplay();

const classString = computed(() => {
  const data = {
    "header-patch-progressive": !display.mobile.value,
    "header-patch-workspaces":
      (appStore.workspaceDrawer && !display.mobile.value && !appStore.rail) ||
      (!chatStore.search.value && appStore.rail && chatStore.commsSidebar),
    "header-patch-workspaces-search":
      (appStore.workspaceDrawer &&
        !display.mobile.value &&
        !appStore.rail &&
        chatStore.search.value &&
        chatStore.commsSidebar &&
        !chatStore.communicationsSidebar) ||
      (chatStore.search.value && appStore.rail && chatStore.commsSidebar)
  } as { [key: string]: boolean };
  if (appStore.rail) {
    for (const key in data) {
      data[key + "-rail"] = data[key];
      delete data[key];
    }
  }
  return data;
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
