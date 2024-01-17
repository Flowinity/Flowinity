<template>
  <v-app-bar
    :extension-height="0"
    app
    class="header"
    color="dark"
    density="comfortable"
    flat
    floating
  >
    <FlowinityBannerHandler v-if="!$vuetify.display.mobile" />
    <v-spacer />
    <!-- theme v-menu -->
    <v-menu
      :close-on-content-click="false"
      :nudge-width="200"
      :nudge-height="200"
      offset-x
      origin="top right"
      transition="scale-transition"
    >
      <template #activator="{ props }">
        <v-btn icon v-bind="props" class="mr-2">
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-list>
          <v-list-item @click="changeTheme('light')">Light</v-list-item>
          <v-list-item @click="changeTheme('dark')">Dark</v-list-item>
          <v-list-item @click="changeTheme('amoled')">AMOLED</v-list-item>
        </v-list>
      </v-card>
    </v-menu>
    <v-btn color="primary" to="/register">Register</v-btn>
    <v-btn color="primary" to="/login">Login</v-btn>
    <template v-if="redirected" #extension>
      <v-alert
        :value="redirected"
        border="start"
        class="ma-0 rounded-0"
        closable
        color="primary"
        density="comfortable"
        elevation="0"
        type="info"
        variant="tonal"
      >
        You have been redirected to {{ $app.site.name }}'s primary domain.
      </v-alert>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FlowinityBanner from "@/components/Brand/FlowinityBanner.vue";
import FlowinityBannerHandler from "@/components/Brand/FlowinityBannerHandler.vue";

export default defineComponent({
  name: "UnauthenticatedAppBar",
  components: { FlowinityBannerHandler, FlowinityBanner },
  computed: {
    redirected() {
      return this.$route.query.redirected && this.$route.path === "/home";
    }
  },
  methods: {
    changeTheme(theme: string) {
      this.$vuetify.theme.global.name = theme;
      localStorage.setItem("theme", theme);
    }
  }
});
</script>

<style lang="scss">
.header {
  background: rgba(51, 51, 51, 0.1) !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}
</style>
