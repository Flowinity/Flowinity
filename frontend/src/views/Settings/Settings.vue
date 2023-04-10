<template>
  <v-container>
    <v-card>
      <v-tabs>
        <v-tab to="/settings/dashboard" prepend-icon="mdi-account">
          Account
        </v-tab>
        <v-tab to="/settings/security" prepend-icon="mdi-lock">Security</v-tab>
        <v-tab to="/settings/clients" prepend-icon="mdi-cellphone-cog">
          {{ $app.cordova ? "Mobile Setup" : "Setup" }}
        </v-tab>
        <v-tab to="/settings/domains" prepend-icon="mdi-web">Domains</v-tab>
        <v-tab to="/settings/slideshows" prepend-icon="mdi-image-multiple">
          Slideshows
        </v-tab>
        <v-tab to="/settings/about" prepend-icon="mdi-information">
          About TPU
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
