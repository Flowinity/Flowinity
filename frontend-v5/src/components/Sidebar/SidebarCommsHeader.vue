<template>
  <div class="flex items-center w-full">
    <transition name="dialog-transition">
      <div
        class="flex justify-between items-center w-full"
        v-if="!searchActive"
      >
        <div class="flex">
          <component :is="appStore.currentRail?.icon" class="w-8 ml-4" />
          <p class="text-xl font-semibold ml-4">
            {{ appStore.currentRail.name }}
          </p>
        </div>
        <div>
          <tpu-button @click.prevent.stop="searchActive = !searchActive" icon>
            <RiSearchLine style="width: 20px" />
          </tpu-button>
        </div>
      </div>
      <div class="flex pl-2" v-else>
        <comms-search-input
          ref="searchInput"
          v-model="search"
          :placeholder="$t('chats.search')"
          @keydown.enter="chatStore.uiOptions.searchSidebar = true"
        />
        <tpu-button @click.prevent.stop="searchActive = !searchActive" icon>
          <RiCloseLine style="width: 20px" />
        </tpu-button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import functions from "@/plugins/functions";
import SideBarItem from "@/components/Framework/Navigation/SideBarItem.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { useChatStore } from "@/stores/chat.store";
import { RailMode, useAppStore } from "@/stores/app.store";
import { ref } from "vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import RiSearchLine from "vue-remix-icons/icons/ri-search-line.vue";
import CommsSearchInput from "@/components/Communications/CommsSearchInput.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";

const chatStore = useChatStore();
const appStore = useAppStore();
const searchActive = ref(false);
const search = ref("");
</script>
