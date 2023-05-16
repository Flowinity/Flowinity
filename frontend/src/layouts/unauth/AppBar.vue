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
    <h1
      id="tpu-brand-logo"
      class="text-gradient unselectable ml-4"
      style="z-index: 10; cursor: pointer; font-size: 32px"
      title="TroploPrivateUploader"
      @click="$router.push('/')"
    >
      TPU
    </h1>
    <v-spacer></v-spacer>
    <v-btn color="primary" to="/register">Register</v-btn>
    <v-btn color="primary" to="/login">Login</v-btn>
    <template v-if="redirected" v-slot:extension>
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
        You have been redirected to TPU's primary domain.
      </v-alert>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UnauthenticatedAppBar",
  computed: {
    redirected() {
      return this.$route.query.redirected && this.$route.path === "/home";
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
