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
    <p>Version: {{ $app.version.current }}</p>
    <p>
      Build date:
      {{ $date($app.version.date).format("DD/MM/YYYY hh:mm:ss A") }}
    </p>
    <p>Build date relative: {{ $date($app.version.date).fromNow() }}</p>
    <p>Backend environment: {{ $app.site.release }}</p>
    <template v-if="$app.site.connection">
      <p>Backend connecting IP: {{ $app.site.connection.ip }}</p>
      <p v-if="$app.site.connection.whitelist">
        IP whitelist groups: {{ $app.site.connection.whitelist.groups }}
      </p>
    </template>
    <p>Server: {{ $app.site.server }}</p>
    <a class="text-gradient" href="/api/v3/docs">
      TPU API Documentation (WIP, v3)
    </a>
    <br />
    <router-link to="/credits" class="text-gradient mt-5">Credits</router-link>
    <p class="mt-5 text-gradient">TroploPrivateUploader</p>
    <p>&copy; {{ $date().format("YYYY") }} Troplo Services</p>
    <v-btn
      @click="crash"
      class="mt-2"
      v-if="$experiments.experiments['ACCOUNT_DEV_ELIGIBLE']"
    >
      Crash TPU (dev)
    </v-btn>
    <v-btn
      @click="expTrue"
      class="mt-2"
      v-if="$experiments.experiments['ACCOUNT_DEV_ELIGIBLE']"
    >
      Enable all experiments
    </v-btn>
    <v-btn
      @click="expFalse"
      class="mt-2"
      v-if="$experiments.experiments['ACCOUNT_DEV_ELIGIBLE']"
    >
      Disable all experiments
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
    },
    expTrue() {
      for (const key in this.$experiments.experiments) {
        if (key === "meta") return;
        this.$experiments.experiments[key] = true;
      }
    },
    expFalse() {
      for (const key in this.$experiments.experiments) {
        if (key === "meta") return;
        this.$experiments.experiments[key] = false;
      }
    }
  }
});
</script>

<style scoped></style>
