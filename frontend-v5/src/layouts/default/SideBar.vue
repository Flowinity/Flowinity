<script setup lang="ts">
import { RailMode, useAppStore } from "@/stores/app.store";
import SideBarItem from "@/components/Framework/Navigation/SideBarItem.vue";
//@ts-ignore
import SidebarCollections from "@/components/Sidebar/SidebarCollections.vue";
import SidebarComms from "@/components/Sidebar/SidebarComms.vue";
import SidebarMail from "@/components/Sidebar/SidebarMail.vue";

const appStore = useAppStore();

const props = defineProps({
  drawer: Boolean
});
</script>

<template>
  <aside
    class="border-r-2 sticky z-50 dark:border-outline-dark dark:bg-sidebar-dark border-dark flex flex-col overflow-y-auto overflow-x-hidden"
    style="min-width: 256px; max-width: 256px"
    :class="{ 'h-screen': !props.drawer, 'h-[calc(100vh-64px)]': props.drawer }"
  >
    <div
      class="flex justify-between pt-0 dark:border-outline-dark border-b-2 border-outline-dark"
      style="min-height: 64px; max-height: 64px"
    >
      <Transition name="slide-fade" mode="out-in">
        <div
          v-if="appStore.currentRail"
          :key="appStore.currentRail?.id"
          class="flex items-center"
        >
          <component :is="appStore.currentRail?.icon" class="w-8 ml-4" />
          <p class="text-xl font-semibold ml-4">
            {{ appStore.currentRail.name }}
          </p>
        </div>
      </Transition>
      <div id="sidebar-actions" class="flex items-center mr-4" />
    </div>

    <Transition name="slide-fade" mode="out-in">
      <div
        :key="appStore.currentRail?.id"
        class="justify-between flex-col flex-1 px-3"
        style="margin-top: 16px"
      >
        <div class="flex-col flex gap-y-2 flex-1 relative">
          <SidebarComms v-show="appStore.currentRail?.id === RailMode.CHAT" />
          <SidebarMail v-show="appStore.currentRail?.id === RailMode.MAIL" />
          <SideBarItem
            v-for="item in appStore.currentNavOptions"
            :key="item.name"
            class="flex h-12 items-center"
            :item="item"
          />
          <SidebarCollections
            v-show="appStore.currentRail?.id === RailMode.GALLERY"
          />
        </div>
      </div>
    </Transition>
    <Transition name="slide-fade" mode="out-in">
      <div
        :key="appStore.currentRail?.id"
        class="flex-col flex gap-y-2 px-3"
        style="margin-bottom: 16px"
      >
        <SideBarItem
          v-for="item in appStore.currentMiscNavOptions"
          :key="item.name"
          class="flex items-center text-medium-emphasis-dark"
          :item="item"
          style="fill: #878889"
        />
      </div>
    </Transition>
  </aside>
</template>

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

<style lang="scss">
.vue-simple-context-menu {
  $light-grey: #0190ea;
  $black: #000000;
  $blue: #0190ea;
  $white: #ffffff;
  $grey: #0190ea;
  background-color: $light-grey;
  border-bottom-width: 0px;
  border-radius: 4px;
  box-shadow: 0 3px 6px 0 rgba($black, 0.2);
  display: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  left: 0;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  z-index: 1000000;

  &--active {
    display: block;
  }

  &__item {
    align-items: center;
    color: $black;
    cursor: pointer;
    display: flex;
    padding: 5px 15px;

    &:hover {
      background-color: $blue;
      color: $white;
    }
  }

  &__divider {
    background-clip: content-box;
    background-color: $grey;
    box-sizing: content-box;
    height: 2px;
    padding: 4px 0;
    pointer-events: none;
  }

  // Have to use the element so we can make use of `first-of-type` and `last-of-type`
  li {
    &:first-of-type {
      margin-top: 4px;
    }

    &:last-of-type {
      margin-bottom: 4px;
    }
  }
}
</style>
