<template>
  <v-container class="text-center">
    <p
      class="text-gradient"
      style="font-size: 69px"
      title="TroploPrivateUploader"
    >
      TPU
    </p>
    <v-divider></v-divider>
    <p class="mt-5">Product name: TPUvNEXT</p>
    <p>Version: N/A</p>
    <p>Build date: N/A</p>
    <p>Backend environment: {{ $app.site.release }}</p>
    <p class="mt-5 text-gradient">TroploPrivateUploader</p>
    <p>&copy; {{ $date().format("YYYY") }} Troplo Services</p>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "About",
  data() {
    return {};
  }
});
</script>

<style scoped></style>
