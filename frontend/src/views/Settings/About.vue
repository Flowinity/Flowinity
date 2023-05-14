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
    <br />
    <router-link to="/credits" class="text-gradient mt-5">
      {{ $t("settings.about.credits") }}
    </router-link>
    <p class="mt-5 text-gradient">TroploPrivateUploader</p>
    <p>&copy; {{ $date().format("YYYY") }} Troplo Services</p>
    <v-btn
      @click="crash"
      class="mt-2"
      v-if="$experiments.experiments['ACCOUNT_DEV_ELIGIBLE']"
    >
      {{ $t("settings.about.crash") }}
    </v-btn>
    <v-btn
      @click="expTrue"
      class="mt-2"
      v-if="$experiments.experiments['ACCOUNT_DEV_ELIGIBLE']"
    >
      {{ $t("settings.about.expEnable") }}
    </v-btn>
    <v-btn
      @click="expFalse"
      class="mt-2"
      v-if="$experiments.experiments['ACCOUNT_DEV_ELIGIBLE']"
    >
      {{ $t("settings.about.expDisable") }}
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
