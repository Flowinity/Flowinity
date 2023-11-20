<template>
  <CoreSidebar
    v-model="drawer"
    name="workspaces"
    app
    color="dark"
    floating
    :location="$app.rail ? 'left' : 'right'"
    :class="classSidebar"
    :width="
      !$app.rail &&
      $chat.search.value &&
      $chat.isCommunications &&
      !$chat.communicationsSidebar
        ? 350
        : undefined
    "
  >
    <WorkspacesSidebarList
      v-if="
        $app.rail ||
        $chat.memberSidebar ||
        !$chat.isCommunications ||
        $app.forcedWorkspaceDrawer
      "
    ></WorkspacesSidebarList>
    <MemberSidebarList v-else></MemberSidebarList>
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
  </CoreSidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WorkspacesSidebarList from "@/layouts/default/WorkspacesSidebarList.vue";
import MemberSidebarList from "@/layouts/communications/MemberSidebarList.vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";

export default defineComponent({
  name: "WorkspacesSidebar",
  components: {
    CoreSidebar,
    MemberSidebarList,
    WorkspacesSidebarList
  },
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
