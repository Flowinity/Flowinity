<template>
  <v-list nav>
    <v-list-item
      v-for="(item, index) in sidebar"
      :key="item.id"
      :disabled="
        !$functions.checkScope(item.scope, $user.user?.scopes) ||
        !access(item.level)
      "
      :exact="item.exact"
      :prepend-icon="item.icon"
      :to="item.path"
      class="ml-1"
      link
      style="text-transform: unset !important"
      @click="handleClick(index)"
    >
      <v-list-item-title>
        {{ item.name }}
        <v-chip
          v-if="item.new && !item.warning"
          class="pb-n2 ml-1"
          color="green"
          size="x-small"
          variant="tonal"
        >
          NEW
        </v-chip>
        <v-chip
          v-if="item.warning"
          class="pb-n2 ml-1"
          size="x-small"
          variant="tonal"
        >
          {{ item.warning }}
        </v-chip>
        <v-icon
          v-if="!$functions.checkScope(item.scope, $user.user?.scopes)"
          color="grey lighten-1"
          size="small"
          style="float: right"
        >
          mdi-lock
        </v-icon>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import {defineComponent} from "vue"

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
          level: 1
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
          level: 2
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
        },
        {
          id: 13,
          name: "Badges",
          path: "/admin/badges",
          icon: "mdi-trophy",
          exact: true,
          scope: "*",
          level: 1
        },
        {
          id: 14,
          name: "AutoCollects",
          path: "/admin/autoCollect",
          icon: "mdi-robot",
          exact: true,
          scope: "*",
          level: 2
        },
        {
          id: 15,
          name: "IP Whitelist Check",
          path: "/admin/ip",
          icon: "mdi-shield-check",
          exact: true,
          scope: "user.view",
          level: 0
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
      }[]
    }
  },
  methods: {
    access(level: number) {
      if (level === 0) {
        return true
      } else if (level === 1) {
        return this.$user.user?.administrator || this.$user.user?.moderator
      } else if (level === 2) {
        return this.$user.user?.administrator
      } else {
        return false
      }
    },
    handleClick(index: number) {
      this.sidebar[index].click?.call(this)
    }
  }
})
</script>

<style scoped></style>
