<template>
  <v-container>
    <v-card :class="{ 'd-flex': !$vuetify.display.mobile }">
      <v-tabs :direction="$vuetify.display.mobile ? 'horizontal' : 'vertical'">
        <v-tab prepend-icon="mdi-account" to="/settings/dashboard">
          {{ $t("settings.tabs.account") }}
        </v-tab>
        <v-tab prepend-icon="mdi-account" to="/settings/privacy">
          {{ $t("settings.tabs.privacy") }}
        </v-tab>
        <v-tab prepend-icon="mdi-lock" to="/settings/security">
          {{ $t("settings.tabs.security") }}
        </v-tab>
        <v-tab prepend-icon="mdi-cellphone-cog" to="/settings/clients">
          {{
            $app.cordova
              ? $t("settings.tabs.mobileSetup")
              : $t("settings.tabs.setup")
          }}
        </v-tab>
        <v-tab prepend-icon="mdi-web" to="/settings/domains">
          {{ $t("settings.tabs.domains") }}
        </v-tab>
        <v-tab
          v-if="$experiments.experiments.USER_V3_MODIFY"
          prepend-icon="mdi-link-variant"
          to="/settings/integrations"
        >
          {{ $t("settings.tabs.integrations") }}
          <v-btn
            v-if="$user.user?.integrations?.some((i) => i.error)"
            class="mr-n2"
            color="red"
            icon
            size="x-small"
          >
            <v-icon left>mdi-alert</v-icon>
            <v-tooltip activator="parent" location="top">
              {{ $t("settings.tabs.integrationError") }}
            </v-tooltip>
          </v-btn>
        </v-tab>
        <v-tab prepend-icon="mdi-code-tags" to="/settings/developer">
          {{ $t("settings.tabs.developer") }}
        </v-tab>
        <v-tab prepend-icon="mdi-image-multiple" to="/settings/slideshows">
          {{ $t("settings.tabs.slideshows") }}
        </v-tab>
        <v-tab prepend-icon="mdi-information" to="/settings/about">
          {{ $t("settings.tabs.about") }}
        </v-tab>
        <v-spacer></v-spacer>
        <template v-if="$vuetify.display.mobile">
          <v-progress-circular
            v-if="loading"
            class="mt-2 mr-2"
            indeterminate
            size="24"
            width="3"
          ></v-progress-circular>
        </template>
        <template v-else>
          <v-fade-transition :model-value="loading">
            <v-toolbar
              density="compact"
              class="text-center justify-center"
              v-if="loading"
            >
              <v-spacer></v-spacer>
              Saving...
              <v-spacer></v-spacer>
            </v-toolbar>
          </v-fade-transition>
        </template>
      </v-tabs>
      <v-container>
        <router-view @loading="loading = $event" @update="update"></router-view>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SettingsCore",
  data() {
    return {
      loading: false
    };
  },
  methods: {
    async update() {
      try {
        this.loading = true;
        await this.$user.save();
        await new Promise((resolve) => setTimeout(resolve, 300));
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>

<style scoped></style>
