<template>
  <v-navigation-drawer
    v-model="$app.workspaceDrawer"
    app
    color="dark"
    floating
    location="right"
    :class="
      $app.workspaceDrawer && !$vuetify.display.mobile ? 'sidebar-patch' : ''
    "
  >
    <WorkspacesSidebarList></WorkspacesSidebarList>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WorkspacesSidebarList from "@/layouts/default/WorkspacesSidebarList.vue";

export default defineComponent({
  name: "WorkspacesSidebar",
  components: { WorkspacesSidebarList }
});
</script>

<style scoped></style>
