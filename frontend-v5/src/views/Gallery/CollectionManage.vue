<template>
  <auto-collects
    :query="UserCollectionsQuery"
    :variables="{
      input: {
        onlyInvited: true
      }
    }"
    obj-key="collections"
    @click="() => {}"
    class="cursor-default"
  >
    <template #subtitle="{ item, query }">
      <p class="mb-1">- {{ item.user.username }}</p>
      <div class="flex gap-2">
        <ApolloMutation
          :mutation="ActOnCollectionInviteMutation"
          :variables="{ input: { collectionId: item.id, accept: true } }"
          @done="query.refetch()"
          v-slot="{ mutate, loading }"
        >
          <tpu-button color="green" :loading="loading" @click="mutate">
            <RiCheckLine style="width: 20px" />
          </tpu-button>
        </ApolloMutation>
        <ApolloMutation
          :mutation="ActOnCollectionInviteMutation"
          :variables="{ input: { collectionId: item.id, accept: false } }"
          @done="
            query.refetch();
            $toast('test');
          "
          v-slot="{ mutate, loading }"
        >
          <tpu-button color="red" :loading="loading" @click="mutate">
            <RiCloseLine style="width: 20px" />
          </tpu-button>
        </ApolloMutation>
      </div>
    </template>
    <template #no-content>
      <tpu-no-content>
        <template #icon>
          <RiCheckboxMultipleFill />
        </template>
        <template #title>No pending invites!</template>
        <template #description>
          When friends invite you to their collections, you will see them here.
        </template>
      </tpu-no-content>
    </template>
    <template #options>
      <span></span>
    </template>
  </auto-collects>
</template>

<script setup lang="ts">
import AutoCollects from "@/views/AutoCollects/AutoCollects.vue";
import { UserCollectionsQuery } from "@/graphql/collections/getUserCollections.graphql";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { useI18n } from "vue-i18n";
import { ActOnCollectionInviteMutation } from "@/graphql/collections/addToCollection.graphql";
import RiCheckboxMultipleFill from "vue-remix-icons/icons/ri-checkbox-multiple-fill.vue";
import TpuNoContent from "@/components/Framework/NoContent/TpuNoContent.vue";
import { markRaw, onMounted } from "vue";
import { RailMode, useAppStore } from "@/stores/app.store";
import RiCollageLine from "vue-remix-icons/icons/ri-collage-line.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import RiCheckLine from "vue-remix-icons/icons/ri-check-line.vue";

const { t } = useI18n();
const appStore = useAppStore();

onMounted(() => {
  appStore.currentNavItem = {
    item: {
      name: "Collection Invites",
      icon: markRaw(RiCollageLine),
      path: "/collections/manage",
      selectedIcon: markRaw(RiCollageLine),
      _rail: RailMode.GALLERY
    },
    rail: [
      appStore.navigation.railOptions.find(
        (rail) => rail.id === RailMode.GALLERY
      )
    ]
  };
});
</script>

<style scoped></style>
