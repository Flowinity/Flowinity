<template></template>

<script setup lang="ts">
import { useApolloClient } from "@vue/apollo-composable";
import { AutoCollectRuleQuery } from "@/graphql/autoCollects/getRules.graphql";
import { AutoCollectRule } from "@/gql/graphql";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { markRaw } from "vue";
import { RailMode, useAppStore } from "@/stores/app.store";
import RiSparkling2Line from "vue-remix-icons/icons/ri-sparkling-2-line.vue";
import RiSettings5Line from "vue-remix-icons/icons/ri-settings-5-line.vue";

const rule = ref<AutoCollectRule | null>(null);
const route = useRoute();
const appStore = useAppStore();

async function getRule() {
  const {
    data: { autoCollectRule }
  } = await useApolloClient().client.query({
    query: AutoCollectRuleQuery,
    variables: {
      input: { id: parseInt(route.params.id) }
    }
  });
  rule.value = autoCollectRule;

  appStore.currentNavItem = {
    item: {
      name: autoCollectRule.name,
      icon: markRaw(RiSparkling2Line),
      path: "/auto-collects/settings",
      selectedIcon: markRaw(RiSparkling2Line)
    },
    rail: [
      appStore.navigation.railOptions.find(
        (rail) => rail.id === RailMode.GALLERY
      ),
      appStore.navigation.railOptions.find(
        (rail) => rail.id === RailMode.AUTO_COLLECTS
      ),
      {
        name: "Settings",
        icon: markRaw(RiSettings5Line),
        path: "/auto-collects/settings",
        selectedIcon: markRaw(RiSettings5Line)
      }
    ]
  };
}

onMounted(() => {
  getRule();
});
</script>

<style scoped></style>
