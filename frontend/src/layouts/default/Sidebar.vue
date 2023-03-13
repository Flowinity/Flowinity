<template>
  <InviteAFriend v-model="inviteAFriend"></InviteAFriend>
  <Feedback v-model="feedback"></Feedback>
  <MigrateWizard
    v-model="$app.dialogs.migrateWizard"
    v-if="$experiments.experiments['PROJECT_MERGE']"
  ></MigrateWizard>
  <GoldUpsell v-model="$app.dialogs.gold.value"></GoldUpsell>
  <v-navigation-drawer
    v-model="$app.mainDrawer"
    app
    color="dark"
    floating
    :class="$app.mainDrawer && !$vuetify.display.mobile ? 'sidebar-patch' : ''"
    style="z-index: 2001"
    id="main-drawer"
  >
    <v-card-text
      v-if="
        !$chat.communicationsSidebar &&
        $app.forcedMainDrawer &&
        $chat.isCommunications
      "
      @click="$app.forcedMainDrawer = false"
      style="color: #0190ea; cursor: pointer; font-size: 12px"
    >
      <v-icon>mdi-arrow-right</v-icon>
      Back to Communications
    </v-card-text>
    <v-list
      density="comfortable"
      nav
      :class="{
        'mt-2': !$chat.isCommunications || $chat.communicationsSidebar,
        'mt-n3': $chat.isCommunications && !$chat.communicationsSidebar
      }"
      v-if="
        $chat.communicationsSidebar ||
        $app.forcedMainDrawer ||
        !$chat.isCommunications
      "
    >
      <v-list-item
        class="ml-1 my-1"
        style="text-transform: unset !important"
        v-for="item in sidebar"
        :key="item.id"
        :href="item.externalPath"
        link
        :exact="item.exact"
        :to="item.path"
        @click="handleClick(item.id)"
        :disabled="!$functions.checkScope(item.scope, $user.user?.scopes)"
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
            class="float-right"
            color="grey lighten-1"
            v-if="!$functions.checkScope(item.scope, $user.user?.scopes)"
          >
            mdi-lock
          </v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <ColubrinaSidebarList
      v-else-if="!$chat.communicationsSidebar"
    ></ColubrinaSidebarList>
    <template
      v-slot:append
      v-if="
        $chat.communicationsSidebar ||
        !$chat.isCommunications ||
        $app.forcedMainDrawer
      "
    >
      <div
        class="text-center justify-center"
        v-if="$user.user?.administrator || $user.user?.moderator"
      >
        <small class="mb-2 text-grey">TPU Experimental Overrides (NEXT)</small>
      </div>
      <div class="pa-2" v-if="$user.user?.subscription?.metadata?.hours">
        <v-progress-linear
          color="gold"
          :model-value="calculateJitsi"
          height="25"
          rounded
          class="text-black"
        >
          {{ calculateJitsi }}% ({{
            Math.round($user.user?.subscription?.metadata?.hours)
          }}h/14h)
        </v-progress-linear>
      </div>
      <div class="pa-2">
        <v-progress-linear
          :color="calculateColorQuota"
          :value="calculateQuota"
          height="25"
          rounded
        >
          {{ Math.ceil(calculateQuota) }}% ({{
            $functions.fileSize($user.user?.quota || 0)
          }}/{{ $functions.fileSize($user.user?.plan.quotaMax) }})
        </v-progress-linear>
      </div>
    </template>
    <template v-else v-slot:append><StatusSwitcher></StatusSwitcher></template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import InviteAFriend from "@/components/Dashboard/Dialogs/InviteAFriend.vue";
import MigrateWizard from "@/components/Dashboard/Dialogs/Migrate.vue";
import ColubrinaSidebarList from "@/layouts/colubrina/SidebarList.vue";
import StatusSwitcher from "@/components/Communications/StatusSwitcher.vue";
import Feedback from "@/components/Dashboard/Dialogs/Feedback.vue";
import GoldUpsell from "@/components/Dashboard/Dialogs/Gold.vue";

export default defineComponent({
  name: "Sidebar",
  components: {
    GoldUpsell,
    Feedback,
    StatusSwitcher,
    ColubrinaSidebarList,
    MigrateWizard,
    InviteAFriend,
    UserAvatar
  },
  data() {
    return {
      inviteAFriend: false,
      feedback: false,
      order: []
    };
  },
  computed: {
    calculateQuota() {
      if (!this.$user.user) return 0;
      return (this.$user.user?.quota / this.$user.user?.plan?.quotaMax) * 100;
    },
    calculateColorQuota() {
      if (this.calculateQuota >= 80 && this.calculateQuota < 95) {
        return "warning";
      } else if (this.calculateQuota >= 95) {
        return "error";
      } else {
        return "success";
      }
    },
    sidebar: {
      get() {
        if (!this.$user.user) return [];
        const items = [
          {
            id: 1,
            externalPath: "",
            path: "/",
            name: "Dashboard",
            icon: "mdi-home",
            scope: "user.view",
            exact: true
          },
          {
            id: 2,
            externalPath: "",
            path: "/settings",
            name: "Settings",
            icon: "mdi-account-cog",
            scope: "user.modify"
          },
          {
            id: 6,
            externalPath: "",
            path: "/gallery",
            exact: false,
            name: "Gallery",
            icon: "mdi-image-multiple",
            scope: "gallery.view"
          },
          {
            id: 26,
            externalPath: "",
            name: "Collections",
            path: "/collections",
            icon: "mdi-folder-multiple-image",
            new: false,
            scope: "collections.view"
          },
          {
            id: 28,
            externalPath: "",
            name: "AutoCollects",
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
            externalPath: "",
            name: "Workspaces",
            path: this.$route.name?.toString()?.includes("Workspace")
              ? "/workspaces"
              : this.$app.lastNote
              ? `/workspaces/notes/${this.$app.lastNote}`
              : "/workspaces",
            icon: "mdi-folder-account",
            new: true,
            scope: "workspaces.view",
            experimentsRequired: ["INTERACTIVE_NOTES"]
          },
          {
            id: 35,
            externalPath: "",
            name: "Communications",
            path: this.$chat.selectedChatId
              ? `/communications/${this.$chat.selectedChatId}`
              : "/communications",
            icon: "mdi-message-processing",
            warning: this.$functions.checkScope(
              "chats.view",
              this.$user.user?.scopes
            )
              ? this.$chat.totalUnread || "BETA"
              : false,
            scope: "chats.view",
            experimentsRequired: ["COMMUNICATIONS"]
          },
          {
            id: 36,
            externalPath: "",
            name: "Mail",
            path: "/mail",
            icon: "mdi-email",
            scope: "mail.view",
            experimentsRequired: ["WEBMAIL"]
          },
          {
            id: 27,
            externalPath: "",
            name: "Insights",
            path: "/insights",
            scope: "*",
            icon: "mdi-chart-timeline-variant-shimmer",
            new: false
          },
          {
            id: 31,
            externalPath: "",
            name: "Starred",
            path: "/starred",
            icon: "mdi-star",
            scope: "gallery.view",
            new: false
          },
          {
            id: 20,
            externalPath: "",
            path: "/users",
            name: "Users",
            icon: "mdi-account-group",
            scope: "user.view"
          },
          {
            id: 29,
            click(instance: any) {
              //@ts-ignore
              instance.feedback = true;
            },
            externalPath: "",
            path: "",
            name: "Provide Feedback",
            icon: "mdi-comment-question-outline",
            scope: "*"
          },
          {
            id: 30,
            externalPath: "",
            path: "/changelog",
            name: "Changelog",
            icon: "mdi-history"
          },
          {
            id: 32,
            click(instance: any) {
              instance.inviteAFriend = true;
            },
            externalPath: "",
            path: "",
            name: "Invite a Friend",
            icon: "mdi-gift-outline",
            new: true,
            scope: "*"
          },
          {
            id: 33,
            click(instance: any) {
              instance.$app.dialogs.gold.value = true;
            },
            externalPath: "",
            path: "",
            name: this.$user.gold ? "What's new with Gold?" : "Upgrade to Gold",
            icon: "mdi-plus",
            new: false,
            scope: "user.view",
            experimentsRequired: ["EARLY_ACCESS"]
          },
          {
            id: 38,
            click(instance: any) {
              instance.$app.dialogs.migrateWizard = true;
            },
            externalPath: "",
            path: "",
            name: "Migrate from Colubrina",
            icon: "mdi-chart-gantt",
            new: false,
            scope: "user.view",
            experimentsRequired: ["PROJECT_MERGE"]
          },
          {
            id: 37,
            externalPath: "",
            path: "/admin",
            name: "Admin Panel",
            icon: "mdi-gavel",
            new: false,
            scope: "admin.view",
            experimentsRequired: ["ACCOUNT_DEV_ELIGIBLE"]
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

        return items.filter((item) => {
          if (item.experimentsRequired) {
            for (const experiment of item.experimentsRequired) {
              if (!this.$experiments.experiments[experiment]) {
                return false;
              }
            }
          }
          return true;
        });
        /*
     const storage = localStorage.getItem("sidebarOrder");
     if (!storage) {
       return filtered;
     }
   try {
       const order = JSON.parse(storage);
       if (order) {
         filtered.sort((a, b) => {
           return order.indexOf(a.id) - order.indexOf(b.id);
         });
       }
       return filtered;
     } catch {
       return filtered;
     }*/
      },
      set(val: any) {
        if (!val) return;
        localStorage.setItem(
          "sidebarOrder",
          JSON.stringify(val.map((item: any) => item.id))
        );
        this.order = val;
      }
    },
    calculateJitsi() {
      return (
        Math.round(
          (this.$user.user?.subscription?.metadata?.hours / 14) * 100
        ) || 0
      );
    }
  },
  methods: {
    handleClick(id: number) {
      const item = this.sidebar.find((item) => item.id === id);
      if (item?.click) {
        item.click(this);
      }
    }
  }
});
</script>
