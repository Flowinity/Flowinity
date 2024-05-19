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
    />
    <keep-alive
      :max="<number>$experiments.experiments.CHAT_CACHING || 0"
      v-else
    >
      <component
        :is="MemberSidebarList"
        :key="parseInt(<string>$route.params.chatId)"
        :chat-id="parseInt(<string>$route.params.chatId)"
      />
    </keep-alive>
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
  computed: {
    MemberSidebarList() {
      return MemberSidebarList;
    },
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
      } else return null;
    }
  }
});
</script>
