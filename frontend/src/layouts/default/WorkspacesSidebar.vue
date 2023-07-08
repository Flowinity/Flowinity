<template>
  <v-navigation-drawer
    v-model="drawer"
    :class="classSidebar"
    :location="$app.rail ? 'left' : 'right'"
    :width="
      !$app.rail &&
      $chat.search.value &&
      $chat.isCommunications &&
      !$chat.communicationsSidebar
        ? 350
        : undefined
    "
    app
    color="dark"
    floating
  >
    <WorkspacesSidebarList
      v-if="
        $app.rail ||
        $chat.memberSidebar ||
        !$chat.isCommunications ||
        $app.forcedWorkspaceDrawer
      "
    ></WorkspacesSidebarList>
    <ColubrinaMemberSidebarList v-else></ColubrinaMemberSidebarList>
    <template v-if="$workspaces.versionHistory" v-slot:append>
      <v-btn
        class="my-4 mx-4"
        color="green"
        variant="outlined"
        width="228px"
        @click="restoreVersion"
      >
        Restore Version
      </v-btn>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import WorkspacesSidebarList from "@/layouts/default/WorkspacesSidebarList.vue";
import ColubrinaMemberSidebarList from "@/layouts/colubrina/MemberSidebarList.vue";

export default defineComponent({
  name: "WorkspacesSidebar",
  components: {ColubrinaMemberSidebarList, WorkspacesSidebarList},
  methods: {
    async restoreVersion() {
      await this.axios.patch(
        `/notes/${this.$route.params.id}/restore/${this.$route.params.version}`
      );
      this.$router.push(`/workspaces/notes/${this.$route.params.id}`);
      this.$workspaces.versionHistory = false;
    }
  },
  computed: {
    drawer: {
      get: function () {
        if (this.$app.rail && this.$chat.memberSidebar) return true;
        return this.$app.rail ? true : this.$app.workspaceDrawer;
      },
      set: function (value: boolean) {
        if (this.$app.rail) return;
        this.$app.workspaceDrawer = value;
      }
    },
    classSidebar() {
      if (
        this.$chat.search.value &&
        this.$chat.isCommunications &&
        !this.$chat.communicationsSidebar &&
        this.$app.workspaceDrawer &&
        !this.$vuetify.display.mobile
      ) {
        return "sidebar-patch-alt";
      } else if (
        (this.$app.workspaceDrawer && !this.$vuetify.display.mobile) ||
        this.$app.rail
      ) {
        return "sidebar-patch";
      }
    }
  }
});
</script>

<style scoped></style>
