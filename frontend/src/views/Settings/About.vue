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
    <v-btn
      @click="crash"
      class="mt-2"
      v-if="$experiments.experiments['ACCOUNT_DEV_ELIGIBLE']"
    >
      Crash TPU (dev)
    </v-btn>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "About",
  data() {
    return {};
  },
  methods: {
    crash() {
      throw new Error("Intentional error thrown");
    }
  }
});
</script>

<style scoped></style>
