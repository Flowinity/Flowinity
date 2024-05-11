<template>
  <v-app-bar
    id="navbar"
    :key="$app.activeNags.offset"
    :class="{ ...navbarClasses, ...classString, 'has-image': image }"
    :extension-height="$app.activeNags.offset"
    app
    class="navbar border-b-2 w-full backdrop-blur-lg sticky top-0 z-50 overflow-clip no-image"
    color="dark"
    :flat="true"
    :floating="true"
    v-memo="[
      uiStore.currentNavItem?.item?.name,
      uiStore.currentNavItem?.rail[0]?.id,
      expanded,
      image,
      $vuetify.display.mobile
    ]"
    :style="{ height: expanded ? '195px' : '64px' }"
  >
    <div
      class="flex p-4 justify-between z-50 w-full"
      :class="{ 'items-center': !expanded, 'items-end h-full': expanded }"
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
        <!-- @vue-ignore -->
        <accessible-transition
          v-for="(rail, index) in uiStore.currentNavItem?.rail"
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
        </accessible-transition>
        <accessible-transition mode="out-in" name="slide-up" appear>
          <div
            v-if="
              uiStore.currentNavItem?.item?.path !==
              uiStore.currentNavItem?.rail[0]?.path
            "
            :key="
              uiStore.currentNavItem?.item.name +
              uiStore.currentNavItem?.rail[0]?.id
            "
            class="flex items-center"
          >
            <RiArrowRightSLine
              v-if="
                uiStore.currentNavItem?.item?.path !==
                uiStore.currentNavItem?.rail[0]?.path
              "
              v-memo="[]"
              class="w-6 fill-medium-emphasis-dark"
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
        </accessible-transition>
      </div>
      <!-- TODO: Meet Action Bar -->
      <div class="flex">
        <accessible-transition mode="out-in" name="slide-up" appear>
          <div
            v-if="appStore.dialogs.upload.loading"
            class="flex gap-2 mr-2"
            :class="{ 'items-center': !expanded, 'items-end': expanded }"
          >
            <v-progress-circular
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
            </v-progress-circular>
          </div>
        </accessible-transition>
        <accessible-transition mode="out-in" name="slide-up" appear>
          <div
            v-if="showLoading"
            class="flex gap-2 mr-2"
            :class="{ 'items-center': !expanded, 'items-end': expanded }"
          >
            <v-progress-circular size="24" indeterminate />
          </div>
        </accessible-transition>
        <div
          id="appbar-options-first"
          class="flex gap-2 mr-2"
          :class="{ 'items-center': !expanded, 'items-end': expanded }"
        />
        <div
          id="appbar-options"
          class="flex gap-2 mr-4"
          :class="{ 'items-center': !expanded, 'items-end': expanded }"
        />
      </div>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app.store";
import { useProgressiveUIStore } from "@/store/progressive.store";
import { useUserStore } from "@/store/user.store";
import { computed, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { RiArrowRightSLine, RiMenuLine } from "@remixicon/vue";
import { useDisplay } from "vuetify";
import { useChatStore } from "@/store/chat.store";
import AccessibleTransition from "@/components/Core/AccessibleTransition.vue";

const uiStore = useProgressiveUIStore();
const userStore = useUserStore();
const appStore = useAppStore();
const chatStore = useChatStore();

const image = computed(() => {
  console.log(uiStore.appBarImage);
  return uiStore.appBarImage ? `url(${uiStore.appBarImage})` : undefined;
});
const scrolled = ref(false);
const navbarClasses: Record<any, any> = ref({});
const expanded = ref(false);
/*
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
*/
const route = useRoute();

const display = useDisplay();

const classString = computed(() => {
  return {
    "header-patch-progressive": !display.mobile.value
  } as { [key: string]: boolean };
});

const showLoading = ref(false);

function showLoadingSpinner() {
  showLoading.value = true;
}

let loadingSpinnerTimeout = undefined;

watch(
  () => appStore.componentLoading,
  () => {
    loadingSpinnerTimeout && clearTimeout(loadingSpinnerTimeout);
    if (appStore.componentLoading) {
      loadingSpinnerTimeout = setTimeout(showLoadingSpinner, 50);
    } else {
      showLoading.value = false;
    }
  }
);

onUnmounted(() => {
  loadingSpinnerTimeout && clearTimeout(loadingSpinnerTimeout);
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

.expanded .v-toolbar__content {
  height: unset !important;
}
</style>
