<template>
  <v-container>
    <v-card>
      <v-tabs>
        <v-tab to="/settings/dashboard" prepend-icon="mdi-account">
          {{ $t("settings.tabs.account") }}
        </v-tab>
        <v-tab to="/settings/security" prepend-icon="mdi-lock">
          {{ $t("settings.tabs.security") }}
        </v-tab>
        <v-tab to="/settings/clients" prepend-icon="mdi-cellphone-cog">
          {{
            $app.cordova
              ? $t("settings.tabs.mobileSetup")
              : $t("settings.tabs.setup")
          }}
        </v-tab>
        <v-tab to="/settings/domains" prepend-icon="mdi-web">
          {{ $t("settings.tabs.domains") }}
        </v-tab>
        <v-tab
          to="/settings/integrations"
          prepend-icon="mdi-link-variant"
          v-if="$experiments.experiments.USER_V3_MODIFY"
        >
          {{ $t("settings.tabs.integrations") }}
        </v-tab>
        <v-tab to="/settings/slideshows" prepend-icon="mdi-image-multiple">
          {{ $t("settings.tabs.slideshows") }}
        </v-tab>
        <v-tab to="/settings/about" prepend-icon="mdi-information">
          {{ $t("settings.tabs.about") }}
        </v-tab>
        <v-spacer></v-spacer>
        <v-progress-circular
          v-if="loading"
          indeterminate
          size="24"
          class="mt-2 mr-2"
          width="3"
        ></v-progress-circular>
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
      this.loading = true;
      await this.$user.save();
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.loading = false;
    }
  }
});
</script>

<style scoped></style>
