<template>
  <v-container class="text-center">
    <v-img
      src="@/assets/images/tpu-logo-banner.svg"
      max-height="120"
      class="mb-3"
    />
    <v-divider></v-divider>
    <p class="mt-5">
      {{ $t("settings.about.productName") }}
    </p>
    <p>
      {{
        $t("settings.about.version", {
          version: $app.version.current
        })
      }}
    </p>
    <p>
      {{
        $t("settings.about.buildDate", {
          date: $date($app.version.date).format("DD/MM/YYYY hh:mm:ss A")
        })
      }}
    </p>
    <p>
      {{
        $t("settings.about.relative", {
          date: $date($app.version.date).fromNow()
        })
      }}
    </p>
    <p>
      {{
        $t("settings.about.backend", {
          release: $app.site.release
        })
      }}
    </p>
    <template v-if="$app.site.connection">
      <p>
        {{
          $t("settings.about.ip", {
            ip: $app.site.connection.ip
          })
        }}
      </p>
      <p v-if="$app.site.connection.whitelist">
        {{
          $t("settings.about.ipWhitelist", {
            groups: $app.site.connection.whitelist.groups
          })
        }}
      </p>
    </template>
    <p>
      {{
        $t("settings.about.server", {
          server: $app.site.server
        })
      }}
    </p>
    <a class="text-gradient" href="/api/v3/docs">
      {{ $t("settings.about.docs") }}
    </a>
    <br/>
    <router-link class="text-gradient mt-5" to="/credits">
      {{ $t("settings.about.credits") }}
    </router-link>
    <p class="mt-5">
      <a class="text-gradient" href="https://github.com/Troplo/PrivateUploader">
        TroploPrivateUploader
      </a>
      is licensed under AGPLv3, created by
      <a class="text-gradient" href="https://troplo.com">Troplo.</a>
    </p>
    <v-btn
      v-if="$experiments.experiments['ACCOUNT_DEV_ELIGIBLE']"
      class="mt-2"
      @click="crash"
    >
      {{ $t("settings.about.crash") }}
    </v-btn>
    <v-btn
      v-if="$experiments.experiments['ACCOUNT_DEV_ELIGIBLE']"
      class="mt-2"
      @click="expTrue"
    >
      {{ $t("settings.about.expEnable") }}
    </v-btn>
    <v-btn
      v-if="$experiments.experiments['ACCOUNT_DEV_ELIGIBLE']"
      class="mt-2"
      @click="expFalse"
    >
      {{ $t("settings.about.expDisable") }}
    </v-btn>
  </v-container>
</template>

<script lang="ts">
import {defineComponent} from "vue";

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
