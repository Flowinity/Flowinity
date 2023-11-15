<template></template>

<script setup lang="ts">
import { PartialUserPublic } from "@/gql/graphql";
import { h, markRaw, onMounted, onUnmounted, ref, watch } from "vue";
import { ProfileQuery } from "@/graphql/user/profile.graphql";
import { useRoute } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import { RailMode, useAppStore } from "@/stores/app.store";
import UserAvatar from "@/components/User/UserAvatar.vue";
import RiUserLine from "vue-remix-icons/icons/ri-user-line.vue";
import RiUserFill from "vue-remix-icons/icons/ri-user-fill.vue";

const user = ref<PartialUserPublic | null>(null);
const appStore = useAppStore();
const route = useRoute();

async function getUser() {
  const {
    data: { user: userResult }
  } = await useApolloClient().client.query({
    query: ProfileQuery,
    variables: {
      input: { username: route.params.username }
    }
  });
  user.value = userResult;
  if (user.value?.banner) {
    appStore.appBarImage = appStore.domain + user.value?.banner;
  }

  appStore.currentNavItem = {
    item: {
      name: user.value?.username || "Loading...",
      icon: user.value?.avatar
        ? h(UserAvatar, {
            username: user.value?.username,
            src: appStore.domain + user.value?.avatar,
            size: 32,
            style: "margin: 0px 4px 0px 4px"
          })
        : markRaw(RiUserLine),
      path: route.path,
      selectedIcon: markRaw(RiUserFill),
      _rail: 0
    },
    rail: [
      appStore.navigation.railOptions.find((rail) => rail.id === RailMode.HOME),
      {
        icon: markRaw(RiUserLine),
        name: "Users",
        id: 0,
        path: "/users",
        selectedIcon: markRaw(RiUserFill)
      }
    ]
  };
}

onMounted(() => {
  getUser();
});

watch(
  () => route.params.username,
  (val) => {
    if (!val) return;
    getUser();
  }
);

onUnmounted(() => {
  appStore.appBarImage = null;
});
</script>

<style scoped></style>
