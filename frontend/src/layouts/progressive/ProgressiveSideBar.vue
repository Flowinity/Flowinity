<template>
  <v-navigation-drawer
    v-model="$app.mainDrawer"
    style="min-width: 256px; max-width: 256px; z-index: 2000"
    :class="{ 'sidebar-patch': !$vuetify.display.mobile }"
    :style="{ left: !$app.mainDrawer ? '0' : '72px' }"
    color="dark"
    elevation="0"
    class="no-scroll"
  >
    <div
      class="flex cursor-pointer select-none justify-between pt-0 flowinity-border border-b-2"
      style="min-height: 64px; max-height: 64px"
    >
      <accessible-transition name="slide-fade" mode="out-in">
        <div :key="uiStore.currentRail?.id" class="flex items-center">
          <component :is="uiStore.currentRail?.icon" class="w-8 ml-4" />
          <p class="text-xl font-semibold ml-4">
            {{ uiStore.currentRail.name }}
          </p>
        </div>
      </accessible-transition>
      <div id="sidebar-actions" class="flex items-center mr-4" />
    </div>
    <div
      class="flex justify-between flex-col"
      style="
        height: calc(100vh - 64px);
        width: 255px;
        min-width: 255px;
        max-width: 255px;
      "
    >
      <div
        class="justify-between flex-col flex-1 px-3"
        style="margin-top: 16px"
      >
        <div class="flex-col flex gap-y-2 flex-1 relative">
          <accessible-transition
            name="slide-fade"
            mode="out-in"
            v-for="[rail, entries] in Object.entries(
              uiStore.navigation.options
            )"
            :key="rail"
          >
            <div v-show="uiStore.currentRail?.id === parseInt(rail)">
              <SideBarItem
                v-for="item in entries as NavigationOption[]"
                :key="item.id + item.path"
                class="flex h-12 items-center"
                :item="item"
              />
            </div>
          </accessible-transition>
          <accessible-transition name="slide-fade" mode="out-in">
            <SidebarList v-show="uiStore.currentRail?.id === RailMode.CHAT" />
          </accessible-transition>
          <accessible-transition name="slide-fade" mode="out-in">
            <SidebarCollections
              v-show="uiStore.currentRail?.id === RailMode.GALLERY"
            />
          </accessible-transition>
          <accessible-transition name="slide-fade" mode="out-in">
            <SidebarDebug v-show="uiStore.currentRail?.id === RailMode.DEBUG" />
          </accessible-transition>
          <accessible-transition name="slide-fade" mode="out-in">
            <MailSidebarList
              v-show="uiStore.currentRail?.id === RailMode.MAIL"
            />
          </accessible-transition>
          <accessible-transition name="slide-fade" mode="out-in">
            <WorkspacesSidebarList
              v-show="uiStore.currentRail?.id === RailMode.WORKSPACES"
            />
          </accessible-transition>
          <accessible-transition name="slide-fade" mode="out-in">
            <AdminSidebarList
              v-show="uiStore.currentRail?.id === RailMode.ADMIN"
            />
          </accessible-transition>
        </div>
      </div>
      <accessible-transition name="slide-fade" mode="out-in">
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
      </accessible-transition>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import {
  useProgressiveUIStore,
  RailMode,
  NavigationOption
} from "@/store/progressive.store";
import { useAppStore } from "@/store/app.store";
import { computed } from "vue";
import SidebarList from "@/layouts/communications/SidebarList.vue";
import SideBarItem from "@/layouts/progressive/SideBarItem.vue";
import SidebarDebug from "@/layouts/progressive/SidebarDebug.vue";
import SidebarCollections from "@/layouts/progressive/SidebarCollections.vue";
import MailSidebarList from "@/layouts/mail/SidebarList.vue";
import WorkspacesSidebarList from "@/layouts/default/WorkspacesSidebarList.vue";
import AdminSidebarList from "@/components/Admin/AdminSidebarList.vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";
import AccessibleTransition from "@/components/Core/AccessibleTransition.vue";
import CrashComponent from "@/components/Core/CrashAlt.vue";

const appStore = useAppStore();
const uiStore = useProgressiveUIStore();
</script>
<style>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-active {
  opacity: 0;
  overflow: hidden;
}

.no-scroll * {
  scrollbar-width: none;
}
</style>

<style scoped></style>
