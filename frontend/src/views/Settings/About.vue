<template>
  <v-container class="text-center">
    <v-img
      v-if="rainbow()"
      src="@/assets/images/flowinity-logo-banner-rainbow.svg"
      max-height="120"
      class="mb-3"
      @click="rainbowMode(false)"
    />
    <v-img
      v-else
      src="@/assets/images/flowinity-logo-banner.svg"
      max-height="120"
      class="mb-3"
      @click="rainbowMode(true)"
    />
    <v-divider />
    <p class="mt-5">
      {{ $t("settings.about.productName") }}
    </p>
    <p>
      {{
        $app.platform === Platform.WEB
          ? $t("settings.about.version", {
              version: $app.version.current
            })
          : $t("settings.about.versionDesktop", {
              version: $app.version.current,
              desktopVersion: $app.desktop.version
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
    </template>
    <p>
      {{
        $t("settings.about.server", {
          server: $app.site.server
        })
      }}
    </p>
    <p>
      {{
        $t("settings.about.uptime", {
          uptime: $app.site.uptime
        })
      }}
    </p>
    <p>Platform: {{ $app.platform }}</p>
    <a class="text-gradient" href="https://flowinity.com/graphql">
      {{ $t("settings.about.docs") }}
    </a>
    <br />
    <router-link class="text-gradient mt-5" to="/credits">
      {{ $t("settings.about.credits") }}
    </router-link>
    <p class="mt-5">
      <a class="text-gradient" href="https://github.com/Troplo/PrivateUploader">
        Flowinity
      </a>
      is licensed under AGPLv3, created by
      <a class="text-gradient" href="https://troplo.com">Troplo.</a>
      <br />

      Flowinity, formerly known as PrivateUploader.
    </p>
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
import { defineComponent } from "vue";
import { Platform } from "../../store/app.store";

export default defineComponent({
  name: "About",
  computed: {
    Platform() {
      return Platform;
    }
  },
  data() {
    return {
      clickCount: 0
    };
  },
  methods: {
    rainbowMode(val: boolean) {
      this.clickCount++;
      if (val && this.clickCount > 4) {
        this.$experiments.setExperiment("PRIDE", 1);
        this.clickCount = 0;
        this.$toast.info("Enabled rainbow mode.");
        document.body.classList.add("rainbow");
      } else if (!val) {
        this.$experiments.setExperiment("PRIDE", 0);
        this.$toast.info("Disabled rainbow mode.");
        document.body.classList.remove("rainbow");
      }
    },
    rainbow() {
      return this.$experiments.experiments["PRIDE"];
    },
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
