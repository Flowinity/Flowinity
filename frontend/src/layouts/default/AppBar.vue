<template>
  <v-app-bar
    id="navbar"
    :key="$app.activeNags.offset"
    :class="classString"
    :extension-height="$app.activeNags.offset"
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
    <span>
      <v-tooltip activator="parent" location="bottom" style="z-index: 2001">
        {{
          $app.platform === Platform.LINUX
            ? "Update available in your package manager"
            : "Update available to install"
        }}
      </v-tooltip>
      <v-btn
        v-if="$app.desktop.updateAvailable"
        icon
        class="mr-4"
        size="40"
        :ripple="false"
        @click="
          $app.platform === Platform.LINUX ? () => {} : updateDesktopApp()
        "
      >
        <v-icon>mdi-cloud-download</v-icon>
      </v-btn>
    </span>
    <template
      v-if="
        (!appStore.weather.loading && !$vuetify.display.mobile) ||
        (!appStore.weather.loading &&
          $vuetify.display.mobile &&
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
          {{ appStore.weather.data?.main }}
        </v-tooltip>
      </span>
      <span class="mr-3">
        {{ $app.weatherTemp
        }}{{ $user.user?.weatherUnit.charAt(0).toUpperCase() === "K" ? "" : "°"
        }}{{ $user.user?.weatherUnit.charAt(0).toUpperCase() }}
      </span>
    </template>
    <span id="header-actions" />
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
      <div class="d-flex flex-column" style="width: 100%">
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
          v-if="$app.activeNags.EMAIL_VERIFICATION"
          :icon="false"
          :type="!$user.actions.emailSent.value ? 'error' : 'success'"
          class="rounded-0"
          density="compact"
        >
          <small
            v-if="!$user.actions.emailSent.value"
            class="mr-2 unselectable"
          >
            Please verify your email to access all of {{ appStore.site.name }}!
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
          v-if="$app.activeNags.DOWNLOAD_THE_APP_NAG"
          variant="tonal"
          :icon="false"
          type="info"
          class="rounded-0"
          color="light-blue"
          density="compact"
        >
          <v-icon size="16" class="mr-1">mdi-download</v-icon>
          <small class="unselectable">
            It's better in the app! Download the brand new desktop app for the
            best {{ appStore.site.name }} experience.
          </small>
          <template #append>
            <v-btn
              size="x-small"
              to="/downloads"
              @click="$experiments.setExperiment('DOWNLOAD_THE_APP_NAG', 3)"
            >
              Download now!
            </v-btn>
            <v-icon
              @click="$experiments.setExperiment('DOWNLOAD_THE_APP_NAG', 0)"
              size="16"
              class="ml-3"
            >
              mdi-close-circle
            </v-icon>
          </template>
        </v-alert>
        <v-alert
          v-if="$app.activeNags.ENABLE_AUTOSTART_APP_NAG"
          variant="tonal"
          :icon="false"
          type="info"
          color="light-blue"
          class="rounded-0 align-center"
          density="compact"
        >
          <small class="unselectable">
            Never miss a message when {{ appStore.site.name }} starts at boot!
          </small>
          <template #append>
            <v-btn size="x-small" @click="enableStartup">Enable now!</v-btn>
            <v-icon
              @click="$experiments.setExperiment('ENABLE_AUTOSTART_APP_NAG', 0)"
              size="16"
              class="ml-3"
            >
              mdi-close-circle
            </v-icon>
          </template>
        </v-alert>
        <v-alert
          v-if="$app.activeNags.IAF_NAG"
          variant="tonal"
          type="info"
          color="light-blue"
          class="rounded-0 align-center"
          density="compact"
          :icon="false"
        >
          <v-icon size="16" class="mr-2">mdi-gift</v-icon>
          <small class="unselectable">
            {{
              $user.gold
                ? `Invite a friend to Flowinity today and get another free month of Pro!`
                : `Share the love! Invite a friend to ${appStore.site.name} and both get a free month of Pro!`
            }}
          </small>
          <template #append>
            <v-btn
              size="x-small"
              @click="
                $user.gold
                  ? ($app.dialogs.inviteAFriend = true)
                  : ($app.dialogs.gold.value = true)
              "
            >
              {{ $user.gold ? `Invite a friend!` : `Claim now!` }}
            </v-btn>
            <v-icon
              @click="$experiments.setExperiment('IAF_NAG', 5)"
              size="16"
              class="ml-3"
            >
              mdi-close-circle
            </v-icon>
          </template>
        </v-alert>
      </div>
    </template>
  </v-app-bar>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import Notifications from "@/components/Core/Notifications.vue";
import Pins from "@/components/Communications/Menus/Pins.vue";
import LogoEasterEgg from "@/components/Core/LogoEasterEgg.vue";
import StatusSwitcherList from "@/components/Communications/StatusSwitcherList.vue";
import { Platform, useAppStore } from "@/store/app.store";
import { IpcChannels } from "@/electron-types/ipc";
import { useUserStore } from "@/store/user.store";
import { useExperimentsStore } from "@/store/experiments.store";
import { useDisplay, useTheme } from "vuetify";
import { useChatStore } from "@/store/chat.store";
import { useRouter } from "vue-router";

const theme = useTheme();
const editingName = ref(false);
const appStore = useAppStore();
const userStore = useUserStore();
const experimentsStore = useExperimentsStore();
const chatStore = useChatStore();

onMounted(() => {
  if (appStore.platform === Platform.WEB) return;
  window.electron.ipcRenderer.invoke(IpcChannels.GET_SETTINGS).then((data) => {
    appStore.desktop.nagStartup = data.startup;
  });
});

const toggleTheme = () => {
  const themeName = "amoled";
  localStorage.setItem("theme", themeName);
  theme.global.name.value = themeName;
};

const display = useDisplay();

const classString = computed(() => {
  const data = {
    "header-patch": !display.mobile.value,
    "header-patch-workspaces":
      (appStore.workspaceDrawer && !display.mobile.value && !appStore.rail) ||
      (!chatStore.search.value && appStore.rail && chatStore.commsSidebar),
    "header-patch-workspaces-search":
      (appStore.workspaceDrawer &&
        !display.mobile.value &&
        !appStore.rail &&
        chatStore.search.value &&
        chatStore.commsSidebar &&
        !chatStore.communicationsSidebar) ||
      (chatStore.search.value && appStore.rail && chatStore.commsSidebar)
  } as { [key: string]: boolean };
  if (appStore.rail) {
    for (const key in data) {
      data[key + "-rail"] = data[key];
      delete data[key];
    }
  }
  return data;
});

const router = useRouter();

const dropdown = computed(() => {
  if (!userStore.user) return [];
  return [
    {
      icon: "mdi-account",
      id: 12,
      click() {},
      path: "/u/" + userStore.user.username,
      name: userStore.user.username,
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
        await userStore.logout();
        router.push("/login");
      },
      path: "",
      name: "Logout",
      disabled: false
    }
  ];
});

const enableStartup = () => {
  window.electron.ipcRenderer.send(
    IpcChannels.SET_SETTINGS,
    JSON.stringify({
      startup: true
    })
  );
  experimentsStore.setExperiment("ENABLE_AUTOSTART_APP_NAG", 2);
};

const updateDesktopApp = () => {
  if (appStore.platform === Platform.WEB) return;
  window.electron.ipcRenderer.send(IpcChannels.UPDATE);
};

const handleClickDropdown = (index: number) => {
  dropdown.value[index].click();
};
</script>
