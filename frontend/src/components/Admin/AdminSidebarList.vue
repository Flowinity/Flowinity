<template>
  <v-list nav>
    <v-list-item
      class="ml-1"
      style="text-transform: unset !important"
      v-for="(item, index) in sidebar"
      :key="item.id"
      link
      :exact="item.exact"
      :to="item.path"
      @click="handleClick(index)"
      :disabled="
        !$functions.checkScope(item.scope, $user.user?.scopes) ||
        !access(item.level)
      "
      :prepend-icon="item.icon"
    >
      <v-list-item-title>
        {{ item.name }}
        <v-chip
          class="pb-n2 ml-1"
          v-if="item.new && !item.warning"
          color="green"
          variant="tonal"
          size="x-small"
        >
          NEW
        </v-chip>
        <v-chip
          class="pb-n2 ml-1"
          v-if="item.warning"
          variant="tonal"
          size="x-small"
        >
          {{ item.warning }}
        </v-chip>
        <v-icon
          size="small"
          style="float: right"
          color="grey lighten-1"
          v-if="!$functions.checkScope(item.scope, $user.user?.scopes)"
        >
          mdi-lock
        </v-icon>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminSidebarList",
  computed: {
    sidebar() {
      return [
        {
          id: 1,
          name: "Dashboard",
          path: "/admin/dashboard",
          icon: "mdi-view-dashboard",
          exact: true,
          scope: "*",
          level: 1
        },
        {
          id: 2,
          name: "Users",
          path: "/admin/users",
          icon: "mdi-account-group",
          exact: true,
          scope: "*",
          level: 2
        },
        {
          id: 3,
          name: "Workspaces",
          path: "/admin/workspaces",
          icon: "mdi-domain",
          exact: true,
          scope: "*",
          level: 2
        },

        {
          id: 4,
          name: "Caching",
          path: "/admin/cache",
          icon: "mdi-cached",
          exact: true,
          scope: "*",
          level: 1
        },
        {
          id: 5,
          name: "Collections",
          path: "/admin/collections",
          icon: "mdi-view-list",
          exact: true,
          scope: "*",
          level: 2
        },
        {
          id: 7,
          name: "Communications",
          path: "/admin/communications",
          icon: "mdi-message",
          exact: true,
          scope: "*",
          level: 2
        },
        {
          id: 8,
          name: "Invites",
          path: "/admin/invites",
          icon: "mdi-account-plus",
          exact: true,
          scope: "*",
          level: 1
        },
        {
          id: 9,
          name: "User Experiments",
          path: "/admin/experiments",
          icon: "mdi-flask",
          exact: true,
          scope: "*",
          level: 1
        },
        {
          id: 10,
          name: "Service Explorer",
          path: "/admin/services",
          icon: "mdi-server",
          exact: true,
          scope: "*",
          level: 2
        },
        {
          id: 11,
          name: "Feedback",
          path: "/admin/feedback",
          icon: "mdi-comment-question-outline",
          exact: true,
          scope: "*",
          level: 1
        },
        {
          id: 12,
          name: "Developer Options",
          path: "/admin/dev",
          icon: "mdi-code-tags",
          exact: true,
          scope: "*",
          level: 1
        }
      ] as {
        id: number;
        name: string;
        path: string;
        icon: string;
        exact: boolean;
        scope: string;
        new?: boolean;
        warning?: string;
        click?: () => void;
        level: number;
      }[];
    }
  },
  methods: {
    access(level: number) {
      if (level === 1) {
        return this.$user.user?.administrator || this.$user.user?.moderator;
      } else if (level === 2) {
        return this.$user.user?.administrator;
      } else {
        return false;
      }
    },
    handleClick(index: number) {
      this.sidebar[index].click?.call(this);
    }
  }
});
</script>

<style scoped></style>
