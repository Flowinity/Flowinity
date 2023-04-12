<template>
  <v-app-bar
    color="dark"
    app
    density="comfortable"
    floating
    :class="{
      'header-patch': $app.mainDrawer && !$vuetify.display.mobile,
      'header-patch-workspaces':
        $app.workspaceDrawer &&
        !$vuetify.display.mobile &&
        (!$chat.search.value ||
          !$chat.isCommunications ||
          $chat.communicationsSidebar),
      'header-patch-workspaces-search':
        $app.workspaceDrawer &&
        !$vuetify.display.mobile &&
        $chat.search.value &&
        $chat.isCommunications &&
        !$chat.communicationsSidebar
    }"
    flat
    style="z-index: 1001"
    class="navbar"
    :extension-height="$user.user?.emailVerified ? 5 : 42"
    :key="$user.user?.emailVerified ? 1 : 2"
  >
    <v-app-bar-nav-icon
      style="z-index: 1000"
      v-if="$vuetify.display.mobile || !$app.mainDrawer"
      @click.stop="$app.toggleMain()"
      aria-label="Toggle Main Sidebar"
    >
      <v-icon>mdi-menu</v-icon>
    </v-app-bar-nav-icon>
    <template v-if="!$chat.isCommunications || !$chat.selectedChat">
      <LogoEasterEgg></LogoEasterEgg>
    </template>
    <template v-else>
      <CommunicationsAvatar
        :user="$chat.selectedChat?.recipient"
        :chat="$chat.selectedChat?.recipient ? null : $chat.selectedChat"
        size="32"
        class="ml-4"
        :status="true"
      />
      <h2
        class="unselectable ml-2 limit"
        id="tpu-brand-logo"
        title="TPU Communications"
        v-if="!$vuetify.display.mobile"
      >
        {{ $chat.chatName }}
      </h2>
    </template>
    <v-spacer></v-spacer>
    <div class="mr-2" v-if="$app.site.release === 'dev' && $app.cordova">M</div>
    <small v-if="$app.notesSaving" class="mr-3">Saving...</small>
    <template
      v-if="
        (!$app.weather.loading && !$vuetify.display.mobile) ||
        ($vuetify.display.mobile &&
          !$chat.isCommunications &&
          !$workspaces.isWorkspaces)
      "
    >
      <span>
        <v-img
          :src="`https://openweathermap.org/img/wn/${$app.weather.data?.icon}@2x.png`"
          width="32"
          height="32"
        ></v-img>
        <v-tooltip activator="parent" location="bottom" style="z-index: 2001">
          {{ $app.weather.data?.main }}
        </v-tooltip>
      </span>
      <span class="mr-3">
        {{ $app.weatherTemp }}°{{
          $user.user?.weatherUnit.charAt(0).toUpperCase()
        }}
      </span>
    </template>
    <!-- Workspaces custom actions -->
    <template v-if="$route.path.startsWith('/workspaces/notes/')">
      <v-btn
        icon
        class="mx-1"
        @click="$workspaces.versionHistory = !$workspaces.versionHistory"
      >
        <v-icon>mdi-history</v-icon>
      </v-btn>
      <v-btn icon @click="$workspaces.share.dialog = true" class="mx-1">
        <v-icon>mdi-share</v-icon>
      </v-btn>
    </template>
    <!-- Communications custom actions -->
    <template v-if="$chat.isCommunications && !$vuetify.display.mobile">
      <v-btn icon class="mx-1" v-if="$experiments.experiments.PINNED_MESSAGES">
        <Pins />
        <v-icon>mdi-pin-outline</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="$chat.search.value = !$chat.search.value"
        class="mx-1"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>
    <v-btn icon class="mr-2" aria-label="Notifications">
      <Notifications />
      <v-badge dot color="red" :model-value="$user.unreadNotifications > 0">
        <v-icon class="mx-1">
          {{ $user.unreadNotifications > 0 ? "mdi-bell" : "mdi-bell-outline" }}
        </v-icon>
      </v-badge>
    </v-btn>
    <template v-if="$user.user">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" aria-label="Personal Menu">
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
        @click="$app.toggleWorkspace()"
        :aria-label="
          !$chat.communicationsSidebar && $chat.isCommunications
            ? 'Members Sidebar'
            : 'Workspaces Sidebar'
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
      <v-alert
        v-if="!$user.user?.emailVerified"
        :type="!$user.actions.emailSent.value ? 'error' : 'success'"
        density="compact"
        :icon="false"
        class="rounded-0"
      >
        <small class="mr-2 unselectable" v-if="!$user.actions.emailSent.value">
          Please verify your email to access all of TPU.
        </small>
        <small class="mr-2 unselectable" v-else>
          Verification email sent! Please check your email,
          <strong>{{ $user.user?.email }}</strong>
        </small>
        <template v-slot:append>
          <v-btn
            size="x-small"
            @click="$user.resendVerificationEmail"
            :loading="$user.actions.emailSent.loading"
          >
            Resend Verification Email
          </v-btn>
        </template>
      </v-alert>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import CommunicationsAvatar from "@/components/Communications/CommunicationsAvatar.vue";
import Notifications from "@/components/Core/Notifications.vue";
import { useTheme } from "vuetify";
import Pins from "@/components/Communications/Menus/Pins.vue";
import LogoEasterEgg from "@/components/Core/LogoEasterEgg.vue";

export default defineComponent({
  components: {
    LogoEasterEgg,
    Pins,
    Notifications,
    CommunicationsAvatar,
    UserAvatar
  },
  setup() {
    const theme = useTheme();

    return {
      toggleTheme: () => {
        const themeName = "amoled";
        localStorage.setItem("theme", themeName);
        theme.global.name.value = themeName;
      }
    };
  },
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
          path: "/settings",
          name: "Change Theme",
          disabled: false
        },
        {
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
    handleClickDropdown(index: number) {
      this.dropdown[index].click.call(this);
    }
  }
});
</script>
