<template>
  <transition name="scroll-y-reverse-transition" appear>
    <card padding class="my-4 mx-4">
      <tpu-list>
        <tpu-list-item
          v-for="item in autoCollects"
          :key="item.id"
          @click="$router.push(`/auto-collects/settings/${item.id}`)"
        >
          <div class="flex justify-between">
            <div class="flex items-center gap-2">
              {{ item.name }}
              <tpu-button
                color="medium-emphasis-dark"
                variant="tonal"
                :to="`/collections/${item.collectionId}`"
              >
                <RiCollageLine style="width: 20px" class="mr-2" />
                {{
                  collectionsStore.items.find(
                    (collection) => collection.id === item.collectionId
                  )?.name
                }}
              </tpu-button>
              <tpu-button
                variant="tonal"
                :color="item.enabled ? 'green' : 'red'"
                :no-ripple="true"
              >
                <RiCheckLine
                  v-if="item.enabled"
                  style="width: 20px"
                  class="mr-2"
                />
                <RiCloseLine v-else style="width: 20px" class="mr-2" />
                {{ t(item.enabled ? "generic.enabled" : "generic.disabled") }}
              </tpu-button>
            </div>

            <div class="flex">
              <tpu-button
                variant="passive"
                :to="`/auto-collects/settings/${item.id}`"
                icon
              >
                <RiArrowRightSLine style="width: 20px" />
              </tpu-button>
            </div>
          </div>
        </tpu-list-item>
      </tpu-list>
    </card>
  </transition>
</template>

<script setup lang="ts">
import TpuList from "@/components/Framework/List/TpuList.vue";
import TpuListItem from "@/components/Framework/List/TpuListItem.vue";
import { useApolloClient } from "@vue/apollo-composable";
import { AutoCollectRulesQuery } from "@/graphql/autoCollects/getRules.graphql";
import { AutoCollectRule } from "@/gql/graphql";
import { onMounted, ref } from "vue";
import Card from "@/components/Framework/Card/Card.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiArrowRightSLine from "vue-remix-icons/icons/ri-arrow-right-s-line.vue";
import RiCollageLine from "vue-remix-icons/icons/ri-collage-line.vue";
import RiCheckLine from "vue-remix-icons/icons/ri-check-line.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import { useCollectionsStore } from "@/stores/collections.store";
import { useI18n } from "vue-i18n";
import { h, markRaw } from "vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import RiCollageFill from "vue-remix-icons/icons/ri-collage-fill.vue";
import { RailMode, useAppStore } from "@/stores/app.store";
import RiSettings5Line from "vue-remix-icons/icons/ri-settings-5-line.vue";
const autoCollects = ref<AutoCollectRule[]>([]);
const collectionsStore = useCollectionsStore();
const { t } = useI18n();
const appStore = useAppStore();

async function getAutoCollects() {
  const {
    data: { autoCollectRules }
  } = await useApolloClient().client.query({
    query: AutoCollectRulesQuery
  });
  autoCollects.value = autoCollectRules;
}

onMounted(() => {
  getAutoCollects();
  appStore.currentNavItem = {
    item: {
      name: "Settings",
      icon: markRaw(RiSettings5Line),
      path: "/auto-collects/settings",
      selectedIcon: markRaw(RiSettings5Line)
    },
    rail: [
      appStore.navigation.railOptions.find(
        (rail) => rail.id === RailMode.GALLERY
      ),
      appStore.navigation.railOptions.find(
        (rail) => rail.id === RailMode.AUTO_COLLECTS
      )
    ]
  };
});
</script>

<style scoped></style>
