<template>
  <v-navigation-drawer
    color="dark"
    floating
    location="right"
    v-model="$chat.memberSidebarShown"
    :class="
      $chat.memberSidebarShown &&
      !$chat.memberSidebar &&
      !$vuetify.display.mobile
        ? 'sidebar-patch'
        : ''
    "
  >
    <ColubrinaMemberSidebarList
      v-if="!$app.forcedWorkspaceDrawer"
    ></ColubrinaMemberSidebarList>
    <WorkspacesSidebarList v-else></WorkspacesSidebarList>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColubrinaMemberSidebarList from "@/layouts/colubrina/MemberSidebarList.vue";
import WorkspacesSidebarList from "@/layouts/default/WorkspacesSidebarList.vue";

export default defineComponent({
  name: "ColubrinaMemberSidebar",
  components: { WorkspacesSidebarList, ColubrinaMemberSidebarList }
});
</script>

<style scoped></style>
