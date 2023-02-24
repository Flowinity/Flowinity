<template>
  <v-app-bar
    color="dark"
    app
    density="comfortable"
    floating
    :class="{
      'header-patch': $app.mainDrawer && !$vuetify.display.mobile,
      'header-patch-workspaces':
        $app.workspaceDrawer && !$vuetify.display.mobile
    }"
    flat
    style="z-index: 2001"
    class="navbar"
    extension-height="0"
  >
    <v-app-bar-nav-icon
      style="z-index: 1000"
      v-if="$vuetify.display.mobile"
      @click.stop="$app.mainDrawer = !$app.mainDrawer"
    ></v-app-bar-nav-icon>
    <template v-if="!$chat.isCommunications || !$chat.selectedChat">
      <h1
        style="z-index: 10; cursor: pointer; font-size: 32px"
        class="text-gradient unselectable ml-4"
        @click="$router.push('/')"
        id="tpu-brand-logo"
        title="TroploPrivateUploader"
      >
        TPU
      </h1>
    </template>
    <template v-else>
      <CommunicationsAvatar
        :user="$chat.selectedChat?.recipient"
        v-if="$chat.selectedChat?.recipient"
        size="32"
        class="ml-4"
      />
      <CommunicationsAvatar
        :chat="$chat.selectedChat"
        v-else-if="$chat.selectedChat"
        size="32"
        class="ml-4"
      />
      <h2
        class="unselectable ml-2 limit"
        id="tpu-brand-logo"
        title="TPU Communications"
      >
        {{ $chat.chatName }}
      </h2>
    </template>
    <v-spacer></v-spacer>
    <small v-if="$app.notesSaving" class="mr-3">Saving...</small>
    <v-btn icon>
      <Notifications />
      <v-badge dot color="red" :model-value="$user.unreadNotifications > 0">
        <v-icon>
          {{ $user.unreadNotifications > 0 ? "mdi-bell" : "mdi-bell-outline" }}
        </v-icon>
      </v-badge>
    </v-btn>
    <template v-if="$user.user">
      <v-menu offset-y rounded class="rounded-xxl">
        <template v-slot:activator="{ props }">
          <v-btn class="rounded-xl" icon v-bind="props">
            <UserAvatar :user="$user.user" size="38" />
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, index) in dropdown"
            :key="item.id"
            :disabled="item.disabled"
            :to="item.path"
            @click="handleClickDropdown(index)"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        icon
        class="ml-2"
        @click="
          !$chat.memberSidebar && $chat.isCommunications
            ? ($chat.memberSidebarShown = !$chat.memberSidebarShown)
            : ($app.workspaceDrawer = !$app.workspaceDrawer)
        "
      >
        <v-icon>mdi-menu-open</v-icon>
      </v-btn>
    </template>
    <template v-slot:extension>
      <v-progress-linear
        :model-value="$app.dialogs.upload.percentage"
        color="primary"
        v-if="$app.dialogs.upload.loading"
      >
        <v-tooltip activator="parent" location="top">
          <span>{{ $app.dialogs.upload.percentage }}%</span>
        </v-tooltip>
      </v-progress-linear>
      <v-alert
        class="rounded-0"
        color="blue"
        type="info"
        variant="text"
        v-if="$app.site.alert"
      >
        {{ $app.site.alert }}
      </v-alert>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import CommunicationsAvatar from "@/components/Communications/CommunicationsAvatar.vue";
import Notifications from "@/components/Core/Notifications.vue";

export default defineComponent({
  components: { Notifications, CommunicationsAvatar, UserAvatar },
  computed: {
    dropdown() {
      if (!this.$user?.user) return [];
      return [
        {
          id: 12,
          click() {},
          path: "/u/" + this.$user.user.username,
          name: this.$user.user.username,
          disabled: false
        },
        {
          id: 13,
          click() {},
          path: "",
          name: "Toggle Theme",
          disabled: false
        },
        {
          id: 15,
          click() {
            throw new Error(":skull:");
          },
          path: "",
          name: "Logout",
          disabled: false
        }
      ];
    }
  },
  methods: {
    handleClickDropdown(index: number) {
      this.dropdown[index].click.call(this);
    }
  }
});
</script>
