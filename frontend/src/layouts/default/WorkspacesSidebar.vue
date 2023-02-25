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
    <template v-slot:append v-if="$workspaces.versionHistory">
      <v-btn
        width="228px"
        class="my-4 mx-4"
        variant="outlined"
        color="green"
        @click="restoreVersion"
      >
        Restore Version
      </v-btn>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WorkspacesSidebarList from "@/layouts/default/WorkspacesSidebarList.vue";

export default defineComponent({
  name: "WorkspacesSidebar",
  components: { WorkspacesSidebarList },
  methods: {
    async restoreVersion() {
      await this.axios.patch(
        `/notes/${this.$route.params.id}/restore/${this.$route.params.version}`
      );
      this.$router.push(`/workspaces/notes/${this.$route.params.id}`);
      this.$workspaces.versionHistory = false;
    }
  }
});
</script>

<style scoped></style>
