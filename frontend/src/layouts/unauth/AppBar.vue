<template>
  <v-app-bar
    color="dark"
    app
    density="comfortable"
    floating
    flat
    class="header"
  >
    <h1
      style="z-index: 10; cursor: pointer; font-size: 32px"
      class="text-gradient unselectable ml-4"
      @click="$router.push('/')"
      id="tpu-brand-logo"
      title="TroploPrivateUploader"
    >
      TPU
    </h1>
    <v-spacer></v-spacer>
    <v-btn color="primary" to="/register">Register</v-btn>
    <v-btn color="primary" to="/login">Login</v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UnauthenticatedAppBar"
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
