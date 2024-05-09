<template>
  <v-navigation-drawer
    style="min-width: 256px; max-width: 256px; left: 68px"
    :class="{ 'h-screen': !drawer, 'h-[calc(100vh-64px)]': drawer }"
    class="sidebar-patch"
  >
    <VDropdown :triggers="['click']" placement="top-start" class="w-full">
      <div
        class="flex cursor-pointer select-none justify-between pt-0 dark:border-outline-dark border-b-2 border-outline-dark"
        style="min-height: 64px; max-height: 64px"
      >
        <Transition name="slide-fade" mode="out-in">
          <div
            :key="uiStore.currentRail?.id"
            v-if="
              uiStore.currentRail && uiStore.currentRail?.id !== RailMode.CHAT
            "
            class="flex items-center"
          >
            <component :is="uiStore.currentRail?.icon" class="w-8 ml-4" />
            <p class="text-xl font-semibold ml-4">
              {{ uiStore.currentRail.name }}
            </p>
          </div>
          <SidebarCommsHeader
            v-else-if="uiStore.currentRail?.id === RailMode.CHAT"
          />
        </Transition>
        <div id="sidebar-actions" class="flex items-center mr-4" />
      </div>
      <template #popper>
        <card class="w-full" :secondary="true">
          <tpu-list>
            <tpu-list-item class="p-3 text-red fill-red">
              <div class="flex">
                <ri-close-line style="width: 20px" />
                {{ $t("railbar.actions.removeModule") }}
              </div>
            </tpu-list-item>
          </tpu-list>
        </card>
      </template>
    </VDropdown>
    <Transition name="slide-fade" mode="out-in">
      <div
        class="justify-between flex-col flex-1 px-3"
        :key="uiStore.currentRail?.id"
        style="margin-top: 16px"
      >
        <div class="flex-col flex gap-y-2 flex-1 relative">
          <SidebarList v-if="uiStore.currentRail?.id === RailMode.CHAT" />
          <SidebarMail v-show="uiStore.currentRail?.id === RailMode.MAIL" />
          <SideBarItem
            v-for="item in uiStore.currentNavOptions"
            :key="item.name"
            class="flex h-12 items-center"
            :item="item"
          />
          <SidebarCollections
            v-show="uiStore.currentRail?.id === RailMode.GALLERY"
          />
          <SidebarDebug v-if="uiStore.currentRail?.id === RailMode.DEBUG" />
        </div>
      </div>
    </Transition>
    <Transition name="slide-fade" mode="out-in">
      <div
        class="flex-col flex gap-y-2 px-3"
        style="margin-bottom: 16px"
        :key="uiStore.currentRail?.id"
      >
        <SideBarItem
          v-for="item in uiStore.currentMiscNavOptions"
          :key="item.name"
          class="flex items-center text-medium-emphasis-dark"
          :item="item"
          style="fill: #878889"
        />
      </div>
    </Transition>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useProgressiveUIStore, RailMode } from "@/store/progressive.store";
import { useAppStore } from "@/store/app.store";
import { computed } from "vue";
import SidebarList from "@/layouts/communications/SidebarList.vue";
import SideBarItem from "@/layouts/progressive/SideBarItem.vue";
import SidebarDebug from "@/layouts/progressive/SidebarDebug.vue";

const appStore = useAppStore();
const uiStore = useProgressiveUIStore();

const drawer = computed(() => appStore.mainDrawer);
</script>
<style>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(0.49, 0.61, 0.83, 0.67);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>

<style scoped></style>
