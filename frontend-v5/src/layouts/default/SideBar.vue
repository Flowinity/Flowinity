<script setup lang="ts">
import { RailMode, useAppStore } from "@/stores/app.store";
import SideBarItem from "@/components/Framework/Navigation/SideBarItem.vue";
import { useChatStore } from "@/stores/chat.store";
import { useCollectionsStore } from "@/stores/collections.store";
import TpuOverline from "@/components/Framework/Typography/TpuOverline.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import functions from "@/plugins/functions";
import RiAddLine from "vue-remix-icons/icons/ri-add-line.vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import { computed, ref, watch } from "vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiSortDesc from "vue-remix-icons/icons/ri-sort-desc.vue";
import RiSortAsc from "vue-remix-icons/icons/ri-sort-asc.vue";
import Card from "@/components/Framework/Card/Card.vue";
import TpuList from "@/components/Framework/List/TpuList.vue";
import TpuListItem from "@/components/Framework/List/TpuListItem.vue";
import CreateCollectionDialog from "@/components/Collections/CreateCollectionDialog.vue";

const search = ref("");
const appStore = useAppStore();
const chatStore = useChatStore();
enum SortOption {
  UPDATED,
  ALPHABETICAL,
  CREATED_AT,
  ITEM_COUNT
}
const desc = ref(localStorage.getItem("sidebarCollectionsDesc") !== "false");
watch(
  () => desc.value,
  (val) => {
    localStorage.setItem("sidebarCollectionsDesc", val.toString());
  }
);
const sortOption = ref<SortOption>(
  parseInt(
    localStorage.getItem("sidebarCollectionsSort") ||
      SortOption.UPDATED.toString()
  )
);
watch(
  () => sortOption.value,
  (val) => {
    localStorage.setItem("sidebarCollectionsSort", val.toString());
  }
);
const collectionsStore = useCollectionsStore();
const props = defineProps({
  drawer: Boolean
});
const filteredCollections = computed(() => {
  const items = collectionsStore.items.slice().sort((a, b) => {
    const left = desc.value ? b : a;
    const right = desc.value ? a : b;

    switch (sortOption.value) {
      case SortOption.ITEM_COUNT:
        return (left.itemCount || 0) - (right.itemCount || 0);
      case SortOption.UPDATED:
        return (
          (left.preview?.createdAt
            ? new Date(left.preview.createdAt).getTime()
            : new Date(left.updatedAt).getTime()) -
          (right.preview?.createdAt
            ? new Date(right.preview.createdAt).getTime()
            : new Date(right.updatedAt).getTime())
        );
      case SortOption.ALPHABETICAL:
        return right.name.localeCompare(left.name);
      case SortOption.CREATED_AT:
        return (
          new Date(left.createdAt).getTime() -
          new Date(right.createdAt).getTime()
        );
    }
  });
  return items.filter((collection) =>
    collection.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const createCollection = ref(false);
</script>

<template>
  <aside
    class="border-r-2 sticky z-50 dark:border-outline-dark dark:bg-sidebar-dark border-dark flex flex-col overflow-y-auto overflow-x-hidden"
    style="min-width: 256px; max-width: 256px"
    :class="{ 'h-screen': !props.drawer, 'h-[calc(100vh-64px)]': props.drawer }"
  >
    <CreateCollectionDialog v-model="createCollection" />
    <div
      v-if="appStore.currentRail"
      class="flex items-center pt-0 dark:border-outline-dark border-b-2 border-outline-dark"
      style="min-height: 64px; max-height: 64px"
    >
      <component :is="appStore.currentRail?.icon" class="w-8 ml-4" />
      <p class="text-xl font-semibold ml-4">
        {{ appStore.currentRail.name }}
      </p>
    </div>
    <Transition name="slide-fade" mode="out-in">
      <div
        class="justify-between flex-col flex-1 px-3"
        :key="appStore.currentRail?.id"
        style="margin-top: 16px"
      >
        <div class="flex-col flex gap-y-2 flex-1">
          <template v-if="appStore.currentRail?.id === RailMode.CHAT">
            <div v-for="chat in chatStore.chats" :key="chat.id">
              <SideBarItem :to="`/communications/${chat.association?.id}`">
                <template #icon>
                  <user-avatar
                    :username="chat.type === 'group' ? chat.name : undefined"
                    :user-id="
                      chat.type === 'direct' ? chat.recipient?.id : undefined
                    "
                    :src="
                      chat.type === 'group' && chat.icon
                        ? functions.avatar(chat)
                        : undefined
                    "
                    :status="chat.type === 'direct'"
                    :badge="chat.unread > 99 ? '99+' : chat.unread"
                  ></user-avatar>
                </template>
                <template #title>
                  {{ chatStore.chatName(chat) }}
                </template>
              </SideBarItem>
            </div>
          </template>
          <template v-else>
            <SideBarItem
              v-for="item in appStore.currentNavOptions"
              :key="item.name"
              class="flex h-12 items-center"
              :item="item"
            />
            <template v-if="appStore.currentRail?.id === RailMode.GALLERY">
              <tpu-overline
                position="start"
                style="margin-right: -8px; margin-left: 0.25rem"
              >
                {{ $t("sidebar.collections.title") }}
                <template #end>
                  <tpu-button
                    icon
                    variant="passive"
                    @click="createCollection = true"
                    class="flex items-center justify-center"
                    style="
                      margin-right: 2.25px;
                      margin-left: 6px;
                      margin-top: -0.4rem;
                    "
                  >
                    <RiAddLine
                      style="width: 20px"
                      class="fill-medium-emphasis-dark"
                    />
                  </tpu-button>
                </template>
              </tpu-overline>
              <div class="pl-1 gap-1 flex">
                <text-field
                  class="flex-grow"
                  v-model="search"
                  :label="$t('generic.search')"
                />
                <VDropdown
                  :triggers="['click']"
                  placement="right"
                  class="flex items-center"
                >
                  <tpu-button
                    icon
                    variant="passive"
                    class="flex items-center justify-center"
                    style="width: 40px; height: 40px"
                  >
                    <RiSortDesc v-if="desc" style="width: 20px" />
                    <RiSortAsc v-else style="width: 20px" />
                  </tpu-button>
                  <template #popper>
                    <card :padding="false" class="py-1">
                      <tpu-list>
                        <tpu-overline position="start">
                          {{ $t("sidebar.collections.sort.sort") }}
                        </tpu-overline>
                        <tpu-list-item
                          :selected="sortOption === SortOption.UPDATED"
                          @click="sortOption = SortOption.UPDATED"
                        >
                          {{ $t("sidebar.collections.sort.updated") }}
                        </tpu-list-item>
                        <tpu-list-item
                          :selected="sortOption === SortOption.ALPHABETICAL"
                          @click="sortOption = SortOption.ALPHABETICAL"
                        >
                          {{ $t("sidebar.collections.sort.alphabetical") }}
                        </tpu-list-item>
                        <tpu-list-item
                          :selected="sortOption === SortOption.CREATED_AT"
                          @click="sortOption = SortOption.CREATED_AT"
                        >
                          {{ $t("sidebar.collections.sort.createdAt") }}
                        </tpu-list-item>
                        <tpu-list-item
                          :selected="sortOption === SortOption.ITEM_COUNT"
                          @click="sortOption = SortOption.ITEM_COUNT"
                        >
                          {{ $t("sidebar.collections.sort.itemCount") }}
                        </tpu-list-item>
                        <tpu-overline position="start">
                          {{ $t("sidebar.collections.sort.direction") }}
                        </tpu-overline>
                        <tpu-list-item :selected="!desc" @click="desc = false">
                          {{ $t("sidebar.collections.sort.asc") }}
                        </tpu-list-item>
                        <tpu-list-item :selected="desc" @click="desc = true">
                          {{ $t("sidebar.collections.sort.desc") }}
                        </tpu-list-item>
                      </tpu-list>
                    </card>
                  </template>
                </VDropdown>
              </div>
              <div
                v-for="collection in filteredCollections"
                :key="collection.id"
              >
                <SideBarItem
                  class="flex h-14 items-center"
                  :to="`/collections/${collection.id}`"
                >
                  <template #icon>
                    <user-avatar
                      :status="false"
                      :src="`/i/${collection.avatar || collection.banner}`"
                      :username="collection.name"
                    ></user-avatar>
                  </template>
                  <template #title>
                    {{ collection.name }}
                  </template>
                  <template #subtitle>
                    {{ collection.itemCount?.toLocaleString() || 0 }} items
                  </template>
                </SideBarItem>
              </div>
            </template>
          </template>
        </div>
      </div>
    </Transition>
    <Transition name="slide-fade" mode="out-in">
      <div class="flex-col flex gap-y-2 px-3" :key="appStore.currentRail?.id">
        <SideBarItem
          v-for="item in appStore.currentMiscNavOptions"
          :key="item.name"
          class="flex items-center text-medium-emphasis-dark fill-medium-emphasis-dark"
          :item="item"
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
