<template>
  <div class="w-full">
    <CreateCollectionDialog v-model="createCollection" />
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
          style="margin-right: 2.25px; margin-left: 6px; margin-top: -0.4rem"
        >
          <RiAddLine style="width: 20px" class="fill-medium-emphasis-dark" />
        </tpu-button>
      </template>
    </tpu-overline>
    <div class="pl-1 gap-1 flex w-full">
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
    <div class="flex flex-col gap-4 mt-4">
      <side-bar-item
        to="/collections/manage"
        class="flex h-14 items-center w-full"
        v-if="collectionsStore.invites > 0"
      >
        <template #icon>
          <span style="width: 40px">
            <ri-settings5-line class="w-7 ml-2" />
          </span>
        </template>
        <template #title>
          {{ $t("sidebar.collections.invited") }}
          <tpu-badge color="red" class="rounded-full ml-1">
            {{ collectionsStore.invites }}
          </tpu-badge>
        </template>
      </side-bar-item>
      <div v-for="collection in filteredCollections" :key="collection.id">
        <side-bar-item
          class="flex h-14 items-center w-full"
          :to="`/collections/${collection.id}`"
          @click="collection.new ? updateNew(collection.id) : null"
        >
          <template #icon>
            <user-avatar
              :status="false"
              :avatar="collection.avatar || collection.banner"
              :username="collection.name"
            ></user-avatar>
          </template>
          <template #title>
            <div class="flex items-center gap-2">
              <div
                class="bg-green rounded-full"
                style="
                  width: 10px;
                  height: 10px;
                  min-height: 10px;
                  min-width: 10px;
                  user-select: none;
                "
                v-if="collection.new"
                v-tooltip.top="$t('generic.new')"
              />

              {{ collection.name }}
            </div>
          </template>
          <template #subtitle>
            {{ collection.itemCount?.toLocaleString() || 0 }} items
          </template>
        </side-bar-item>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RailMode, useAppStore } from "@/stores/app.store";
import TextField from "@/components/Framework/Input/TextField.vue";
import TpuList from "@/components/Framework/List/TpuList.vue";
import TpuListItem from "@/components/Framework/List/TpuListItem.vue";
import TpuOverline from "@/components/Framework/Typography/TpuOverline.vue";
import RiAddLine from "vue-remix-icons/icons/ri-add-line.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiSortDesc from "vue-remix-icons/icons/ri-sort-desc.vue";
import RiSortAsc from "vue-remix-icons/icons/ri-sort-asc.vue";
import SideBarItem from "@/components/Framework/Navigation/SideBarItem.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import Card from "@/components/Framework/Card/Card.vue";
import { computed, ref, watch } from "vue";
import { useCollectionsStore } from "@/stores/collections.store";
import CreateCollectionDialog from "@/components/Collections/CreateCollectionDialog.vue";
import RiSettings5Line from "vue-remix-icons/icons/ri-settings-5-line.vue";
import { useApolloClient } from "@vue/apollo-composable";
import TpuBadge from "@/components/Framework/Badge/TpuBadge.vue";

const appStore = useAppStore();
const collectionsStore = useCollectionsStore();

const search = ref("");
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

function updateNew(id: number) {
  collectionsStore.items = collectionsStore.items.map((collection) => {
    if (collection.id === id) {
      collection.new = false;
    }
    return collection;
  });
}
</script>

<style scoped></style>
