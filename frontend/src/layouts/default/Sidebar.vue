<template>
  <v-navigation-drawer
    v-model="$app.mainDrawer"
    app
    color="dark"
    floating
    :class="$app.mainDrawer && !$vuetify.display.mobile ? 'sidebar-patch' : ''"
  >
    <v-list dense nav class="mt-2">
      <v-list-item
        class="ml-1"
        style="text-transform: unset !important"
        v-for="(item, index) in sidebar"
        :key="item.id"
        :href="item.externalPath"
        link
        :exact="item.exact"
        :to="item.path"
        @click="handleClick(index)"
        :disabled="!checkScope(item.scope, $user.user.scopes)"
        :prepend-icon="item.icon"
      >
        <v-list-item-title
          >{{ item.name }}
          <v-chip
            class="pb-n2 ml-1"
            v-if="item.new && !item.warning"
            color="green"
            outlined
            x-small
          >
            NEW
          </v-chip>
          <v-chip class="pb-n2 ml-1" v-if="item.warning" outlined x-small>
            {{ item.warning }}
          </v-chip>
          <v-icon
            small
            style="float: right"
            color="grey lighten-1"
            v-if="!checkScope(item.scope, $user.user.scopes)"
          >
            mdi-lock
          </v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  name: "Sidebar",
  components: { UserAvatar },
  computed: {
    sidebar() {
      if (!this.$user.user) return [];
      const items = [
        {
          id: 1,
          click() {},
          externalPath: "",
          path: "/",
          name: "Dashboard",
          icon: "mdi-home",
          scope: "user.view",
          exact: true
        },
        {
          id: 2,
          click() {},
          externalPath: "",
          path: "/settings",
          name: "Settings",
          icon: "mdi-account-cog",
          scope: "user.modify"
        },
        {
          id: 6,
          click() {},
          externalPath: "",
          path: "/gallery",
          exact: false,
          name: "Gallery",
          icon: "mdi-image-multiple",
          scope: "gallery.view"
        },
        {
          id: 26,
          click() {},
          externalPath: "",
          name: "Collections",
          path: "/collections",
          icon: "mdi-folder-multiple-image",
          new: false,
          scope: "collections.view"
        },
        {
          id: 28,
          click() {},
          externalPath: "",
          name: "AutoCollect",
          path: "/autoCollect",
          icon: "mdi-image-auto-adjust",
          new: false,
          scope: "collections.modify",
          warning:
            this.$user.user.pendingAutoCollects > 0
              ? this.$user.user.pendingAutoCollects
              : false
        },
        {
          id: 34,
          click() {},
          externalPath: "",
          name: "Workspaces",
          path: "/notes",
          icon: "mdi-folder-account",
          new: true,
          scope: "workspaces.view",
          experimentsRequired: ["INTERACTIVE_NOTES"]
        },
        {
          id: 27,
          click() {},
          externalPath: "",
          name: "Insights",
          path: "/insights",
          scope: "*",
          icon: "mdi-chart-timeline-variant-shimmer",
          new: false
        },
        {
          id: 31,
          click() {},
          externalPath: "",
          name: "Starred",
          path: "/starred",
          icon: "mdi-star",
          scope: "gallery.view",
          new: false
        },
        {
          id: 20,
          click() {},
          externalPath: "",
          path: "/users",
          name: "Users",
          icon: "mdi-account-group",
          scope: "user.view"
        },
        {
          id: 29,
          click() {},
          externalPath: "",
          path: "",
          name: "Provide Feedback",
          icon: "mdi-comment-question-outline",
          scope: "*"
        },
        {
          id: 30,
          click() {},
          externalPath: "",
          path: "/changelog",
          name: "Changelog & Versions",
          icon: "mdi-history"
        },
        {
          id: 32,
          click() {},
          externalPath: "",
          path: "",
          name: "Invite a Friend",
          icon: "mdi-gift-outline",
          new: true,
          scope: "*"
        },
        {
          id: 33,
          click() {},
          externalPath: "",
          path: "",
          name: "Migration Wizard",
          icon: "mdi-chart-gantt",
          new: false,
          warning: "EXP",
          scope: "*",
          experimentsRequired: ["PROJECT_MERGE"]
        }
        /*{
          id: 33,
          click() {},
          externalPath: "",
          path: "/progress",
          name: "V2 Progress",
          icon: "mdi-chart-gantt",
          new: true
        }*/
        /*{
          id: 9,
          click() {
            this.invite.modal = true
          },
          externalPath: "",
          path: "",
          name: "Invites (" + this.invite.activeCount + ")",
          icon: "mdi-plus"
        },
        {
          id: 22,
          click() {},
          externalPath: "",
          path: "/plans",
          name: "Plans",
          icon: "mdi-star"
        }*/
      ];
      return items;
    }
  },
  methods: {
    handleClick(index: number) {
      this.sidebar[index].click.call(this);
    },
    checkScope(requiredScope: string, scope: string) {
      if (!scope || !requiredScope) {
        return true;
      }
      if (scope === "*") {
        return true;
      }
      // scope is the current session scope, and requiredScope is the scope required for the route, formatted like user.read or user.write
      // check if the required scope is contained in the current scope, comma separated
      const scopes = scope.split(",");
      for (const scope of scopes) {
        if (scope === requiredScope) {
          return true;
        }
        if (scope?.split(".")[0] === requiredScope) {
          return true;
        }
      }
      return false;
    }
  },
  mounted() {
    console.log(this.sidebar);
  }
});
</script>
