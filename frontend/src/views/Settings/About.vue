<template>
  <v-container class="text-center">
    <FlowinityBannerHandler
      style="max-height: 120px; max-width: 100%"
      class="mb-4"
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
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Platform } from "../../store/app.store";
import FlowinityBannerRainbow from "@/components/Brand/FlowinityBannerRainbow.vue";
import FlowinityBannerHandler from "@/components/Brand/FlowinityBannerHandler.vue";

export default defineComponent({
  name: "About",
  components: { FlowinityBannerHandler },
  computed: {
    Platform() {
      return Platform;
    }
  },
  data() {
    return {
      clickCount: 0
    };
  }
});
</script>
