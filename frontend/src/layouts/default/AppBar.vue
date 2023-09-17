<template>
  <v-app-bar
    :key="$user.user?.emailVerified ? 1 : 2"
    :class="classString"
    :extension-height="$user.user?.emailVerified ? 42 : 42"
    app
    class="navbar"
    id="navbar"
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
    <template v-if="!$chat.isCommunications || !$chat.selectedChat">
      <LogoEasterEgg></LogoEasterEgg>
    </template>
    <template v-else>
      <UserAvatar
        :chat="$chat.selectedChat?.recipient ? null : $chat.selectedChat"
        :status="true"
        :user="$chat.selectedChat?.recipient"
        class="ml-4"
        size="32"
        :dot-status="true"
      />
      <h2
        v-if="!$vuetify.display.mobile && !editingName"
        id="tpu-brand-logo"
        class="ml-2 limit pointer unselectable"
        title="TPU Communications"
        @click="$chat.hasPermissions.admin ? (editingName = true) : () => {}"
      >
        {{ $chat.chatName }}
      </h2>
      <v-text-field
        v-else-if="editingName"
        single-line
        variant="outlined"
        density="compact"
        style="height: 40px"
        class="ml-2"
        @blur="editingName = false"
        autofocus
        v-model="$chat.selectedChat.name"
        @keydown.enter="
          $chat.saveSettings({
            name: $chat.selectedChat.name,
            associationId: $chat.selectedChat.association?.id
          });
          editingName = false;
        "
        @keydown.esc="editingName = false"
      ></v-text-field>
    </template>
    <v-spacer></v-spacer>
    <div v-if="$app.site.release === 'dev' && $app.cordova" class="mr-2">M</div>
    <div class="mr-1" v-if="$app.site.release === 'dev' && $app.crashes">
      <v-icon size="18">mdi-skull</v-icon>
      {{ $app.crashes }}
      <v-tooltip activator="parent" location="bottom">
        <span>Crashes</span>
      </v-tooltip>
    </div>
    <small v-if="$app.notesSaving && !$vuetify.display.mobile" class="mr-3">
      Saving...
    </small>
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
          height="32"
          width="32"
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
    <template v-if="$chat.isCommunications && !$vuetify.display.mobile">
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
        <template v-slot:activator="{ props }">
          <v-btn aria-label="Personal Menu" icon v-bind="props">
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
        v-if="!$app.rail"
        :aria-label="
          !$chat.communicationsSidebar && $chat.isCommunications
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
    <template v-slot:extension>
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
        v-if="$app.site.alert"
        class="rounded-0"
        color="blue"
        type="info"
        variant="text"
      >
        {{ $app.site.alert }}
      </v-alert>
      <v-alert
        v-if="!$user.user?.emailVerified"
        :icon="false"
        :type="!$user.actions.emailSent.value ? 'error' : 'success'"
        class="rounded-0"
        density="compact"
      >
        <small v-if="!$user.actions.emailSent.value" class="mr-2 unselectable">
          Please verify your email to access all of TPU.
        </small>
        <small v-else class="mr-2 unselectable">
          Verification email sent! Please check your email,
          <strong>{{ $user.user?.email }}</strong>
        </small>
        <template v-slot:append>
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
        variant="tonal"
        :icon="false"
        type="info"
        class="rounded-0"
        density="compact"
      >
        <small class="unselectable">
          You are using an early access version of TPU.
        </small>
        <template v-slot:append>
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

export default defineComponent({
  components: {
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
          !$chat.isCommunications ||
          $chat.communicationsSidebar),
      'header-patch-workspaces-search':
        $app.workspaceDrawer &&
        !$vuetify.display.mobile &&
        $chat.search.value &&
        $chat.isCommunications &&
        !$chat.communicationsSidebar*/
      const data = {
        "header-patch": !this.$vuetify.display.mobile,
        "header-patch-workspaces":
          (this.$app.workspaceDrawer &&
            !this.$vuetify.display.mobile &&
            !this.$app.rail) ||
          (!this.$chat.search.value &&
            this.$app.rail &&
            this.$chat.isCommunications),
        "header-patch-workspaces-search":
          (this.$app.workspaceDrawer &&
            !this.$vuetify.display.mobile &&
            !this.$app.rail &&
            this.$chat.search.value &&
            this.$chat.isCommunications &&
            !this.$chat.communicationsSidebar) ||
          (this.$chat.search.value &&
            this.$app.rail &&
            this.$chat.isCommunications)
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
