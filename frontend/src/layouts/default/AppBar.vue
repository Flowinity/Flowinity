<template>
  <v-app-bar
    id="navbar"
    :key="$user.user?.emailVerified ? 1 : 2"
    :class="classString"
    :extension-height="$user.user?.emailVerified ? 0 : 42"
    app
    class="navbar"
    color="dark"
    density="comfortable"
    :flat="true"
    :floating="true"
    style="z-index: 1001"
  >
    <v-app-bar-nav-icon
      v-if="!$app.mainDrawer || $vuetify.display.mobile"
      aria-label="Toggle Main Sidebar"
      style="z-index: 1000"
      @click.stop="$app.toggleMain()"
    >
      <v-icon>mdi-menu</v-icon>
    </v-app-bar-nav-icon>
    <template v-if="!$chat.commsSidebar || !$chat.selectedChat">
      <LogoEasterEgg />
    </template>
    <template v-else>
      <UserAvatar
        :chat="$chat.selectedChat?.recipient ? null : $chat.selectedChat"
        :status="true"
        :user="$user.users[$chat.selectedChat?.recipient?.id]"
        class="ml-4"
        size="32"
        :dot-status="true"
      />
      <h2
        v-if="!$vuetify.display.mobile && !editingName"
        id="tpu-brand-logo"
        class="ml-2 limit unselectable"
        title="TPU Communications"
        :class="{ pointer: $chat.hasPermission('OVERVIEW') }"
        @click="$chat.hasPermission('OVERVIEW') ? (editingName = true) : ''"
      >
        {{ $chat.chatName($chat.selectedChat) }}
      </h2>
      <v-text-field
        v-else-if="editingName"
        v-model="$chat.selectedChat.name"
        single-line
        variant="outlined"
        density="compact"
        style="height: 40px"
        class="ml-2"
        autofocus
        @blur="editingName = false"
        @keydown.enter="
          $chat.saveSettings({
            name: $chat.selectedChat.name,
            associationId: $chat.selectedChat.association?.id
          });
          editingName = false;
        "
        @keydown.esc="editingName = false"
      />
    </template>
    <v-spacer />
    <template v-if="!$app.connected">
      <v-progress-circular indeterminate size="24" class="ml-2" />
      <span class="mx-2">Reconnecting...</span>
    </template>
    <small v-if="$app.notesSaving && !$vuetify.display.mobile" class="mr-3">
      Saving...
    </small>
    <v-btn
      icon
      class="mx-2"
      size="40"
      @click="updateDesktopApp"
      v-if="$app.updateAvailable"
    >
      <v-tooltip activator="parent" location="bottom" style="z-index: 2001">
        Update Desktop App
      </v-tooltip>
      <v-icon>mdi-cloud-download</v-icon>
    </v-btn>
    <template
      v-if="
        (!$app.weather.loading && !$vuetify.display.mobile) ||
        ($vuetify.display.mobile &&
          !$chat.commsSidebar &&
          !$workspaces.isWorkspaces)
      "
    >
      <span>
        <v-img
          :src="`https://openweathermap.org/img/wn/${$app.weather.data?.icon}@2x.png`"
          height="32"
          width="32"
        />
        <v-tooltip activator="parent" location="bottom" style="z-index: 2001">
          {{ $app.weather.data?.main }}
        </v-tooltip>
      </span>
      <span class="mr-3">
        {{ $app.weatherTemp
        }}{{ $user.user?.weatherUnit.charAt(0).toUpperCase() === "K" ? "" : "°"
        }}{{ $user.user?.weatherUnit.charAt(0).toUpperCase() }}
      </span>
    </template>
    <!-- Workspaces custom actions -->
    <template v-if="$route.path.startsWith('/workspaces/notes/')">
      <v-btn
        class="mx-1"
        icon
        @click="$workspaces.versionHistory = !$workspaces.versionHistory"
      >
        <v-icon>mdi-history</v-icon>
      </v-btn>
      <v-btn class="mx-1" icon @click="$workspaces.share.dialog = true">
        <v-icon>mdi-share</v-icon>
      </v-btn>
    </template>
    <!-- Communications custom actions -->
    <template v-if="$chat.commsSidebar && !$vuetify.display.mobile">
      <v-btn v-if="$experiments.experiments.PINNED_MESSAGES" class="mx-1" icon>
        <Pins />
        <v-icon>mdi-pin-outline</v-icon>
      </v-btn>
      <v-btn
        class="mx-1"
        icon
        @click="$chat.search.value = !$chat.search.value"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>
    <v-btn aria-label="Notifications" class="mr-2" icon>
      <Notifications />
      <v-badge
        :model-value="$user.unreadNotifications > 0"
        color="red"
        :dot="true"
      >
        <v-icon class="mx-1">
          {{ $user.unreadNotifications > 0 ? "mdi-bell" : "mdi-bell-outline" }}
        </v-icon>
      </v-badge>
    </v-btn>
    <template v-if="$user.user">
      <v-menu>
        <template #activator="{ props }">
          <v-btn aria-label="Personal Menu" icon v-bind="props">
            <UserAvatar
              :user="$user.user"
              size="38"
              :dot-status="true"
              :status="true"
            />
          </v-btn>
        </template>
        <v-card max-width="360">
          <v-list>
            <v-list-item
              v-for="(item, index) in dropdown"
              :key="item.id"
              :disabled="item.disabled"
              :to="item.path"
              :style="{
                color: item.id === 15 ? 'rgb(var(--v-theme-error))' : undefined
              }"
              @click="handleClickDropdown(index)"
            >
              <v-list-item-title>
                <v-icon class="mr-1">
                  {{ item.icon }}
                </v-icon>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <v-divider />
          <StatusSwitcherList />
        </v-card>
      </v-menu>
      <v-btn
        v-if="!$app.rail"
        :aria-label="
          !$chat.communicationsSidebar && $chat.commsSidebar
            ? 'Members Sidebar'
            : 'Workspaces Sidebar'
        "
        class="ml-2"
        icon
        @click="$app.toggleWorkspace()"
      >
        <v-icon>mdi-menu-open</v-icon>
      </v-btn>
    </template>
    <template #extension>
      <v-progress-linear
        v-if="$app.dialogs.upload.loading"
        :model-value="$app.dialogs.upload.percentage"
        color="primary"
      >
        <v-tooltip activator="parent" location="top">
          <span>{{ $app.dialogs.upload.percentage }}%</span>
        </v-tooltip>
      </v-progress-linear>
      <v-alert
        v-if="!$user.user?.emailVerified"
        :icon="false"
        :type="!$user.actions.emailSent.value ? 'error' : 'success'"
        class="rounded-0"
        density="compact"
      >
        <small v-if="!$user.actions.emailSent.value" class="mr-2 unselectable">
          Please verify your email to access all of {{ $app.site.name }}.
        </small>
        <small v-else class="mr-2 unselectable">
          Verification email sent! Please check your email,
          <strong>{{ $user.user?.email }}</strong>
        </small>
        <template #append>
          <v-btn
            :loading="$user.actions.emailSent.loading"
            size="x-small"
            @click="$user.resendVerificationEmail"
          >
            Resend Verification Email
          </v-btn>
        </template>
      </v-alert>
      <v-alert
        v-if="false"
        variant="tonal"
        :icon="false"
        type="info"
        class="rounded-0"
        density="compact"
      >
        <small class="unselectable">Welcome to the new PrivateUploader!</small>
        <template #append>
          <v-btn size="x-small" href="https://privateuploader.com">
            Go to Stable
          </v-btn>
        </template>
      </v-alert>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import Notifications from "@/components/Core/Notifications.vue";
import { useTheme } from "vuetify";
import Pins from "@/components/Communications/Menus/Pins.vue";
import LogoEasterEgg from "@/components/Core/LogoEasterEgg.vue";
import StatusSwitcherList from "@/components/Communications/StatusSwitcherList.vue";
import { Platform } from "@/store/app.store";
import { IpcChannels } from "@/electron-types/ipc";

export default defineComponent({
  components: {
    StatusSwitcherList,
    LogoEasterEgg,
    Pins,
    Notifications,
    UserAvatar
  },
  setup() {
    const theme = useTheme();
    const editingName = ref(false);
    return {
      editingName,
      toggleTheme: () => {
        const themeName = "amoled";
        localStorage.setItem("theme", themeName);
        theme.global.name.value = themeName;
      }
    };
  },
  computed: {
    classString() {
      /* 'header-patch': $app.mainDrawer && !$vuetify.display.mobile,
      'header-patch-workspaces':
        $app.workspaceDrawer &&
        !$vuetify.display.mobile &&
        (!$chat.search.value ||
          !$chat.commsSidebar ||
          $chat.communicationsSidebar),
      'header-patch-workspaces-search':
        $app.workspaceDrawer &&
        !$vuetify.display.mobile &&
        $chat.search.value &&
        $chat.commsSidebar &&
        !$chat.communicationsSidebar*/
      const data = {
        "header-patch": !this.$vuetify.display.mobile,
        "header-patch-workspaces":
          (this.$app.workspaceDrawer &&
            !this.$vuetify.display.mobile &&
            !this.$app.rail) ||
          (!this.$chat.search.value &&
            this.$app.rail &&
            this.$chat.commsSidebar),
        "header-patch-workspaces-search":
          (this.$app.workspaceDrawer &&
            !this.$vuetify.display.mobile &&
            !this.$app.rail &&
            this.$chat.search.value &&
            this.$chat.commsSidebar &&
            !this.$chat.communicationsSidebar) ||
          (this.$chat.search.value && this.$app.rail && this.$chat.commsSidebar)
      } as { [key: string]: boolean };
      if (this.$app.rail) {
        for (const key in data) {
          data[key + "-rail"] = data[key];
          delete data[key];
        }
      }
      return data;
    },
    dropdown() {
      if (!this.$user?.user) return [];
      return [
        {
          icon: "mdi-account",
          id: 12,
          click() {},
          path: "/u/" + this.$user.user.username,
          name: this.$user.user.username,
          disabled: false
        },
        {
          icon: "mdi-palette",
          id: 13,
          click() {},
          path: "/settings",
          name: "Change Theme",
          disabled: false
        },
        {
          icon: "mdi-exit-to-app",
          id: 15,
          async click() {
            //@ts-ignore
            await this.$user.logout();
            //@ts-ignore
            this.$router.push("/login");
          },
          path: "",
          name: "Logout",
          disabled: false
        }
      ];
    }
  },
  methods: {
    updateDesktopApp() {
      if (this.$app.platform === Platform.WEB) return;
      window.electron.ipcRenderer.send(IpcChannels.UPDATE);
    },
    handleClickDropdown(index: number) {
      this.dropdown[index].click.call(this);
    },
    handleClick(id: number) {
      //@ts-ignore
      const item = this.$app.sidebar.find((item) => item.id === id);
      if (item?.click) {
        item.click(this);
      }
    }
  }
});
</script>
