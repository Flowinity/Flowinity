<template>
  <div class="hero">
    <div :class="{ 'mx-5 mobile': $vuetify.display.mobile }" class="hero-body">
      <div class="title">
        <p class="font-bold">Download Flowinity</p>
      </div>
      <div class="subtitle">
        <p class="text-2xl font-semibold">
          Get started with Flowinity on your device today
        </p>
      </div>
      <div class="mt-4">
        <div
          v-if="platform !== 'Android'"
          class="v-btn-group v-btn-group--divided v-theme--amoled v-btn-group--density-default v-btn-toggle"
        >
          <v-btn
            v-if="platform !== 'iOS'"
            class="download-button"
            style="height: 100%"
            variant="tonal"
            :href="
              downloadUrls[platform]?.filter(
                (item) => item.ext === defaults[platform]
              )[0]?.url
            "
          >
            Download for {{ platform }} ({{ defaults[platform] }})
          </v-btn>
          <v-btn v-else class="download-button" disabled variant="tonal">
            Unavailable for iOS
          </v-btn>
          <v-btn
            class="download-button"
            variant="tonal"
            style="height: 100%"
            :disabled="platform === 'iOS'"
            v-if="downloadUrls[platform].length > 1"
          >
            <v-menu
              :close-on-content-click="false"
              offset-y
              location="right"
              activator="parent"
            >
              <v-card>
                <v-list>
                  <v-list-item
                    v-for="item in downloadUrls[platform]"
                    :key="item.ext"
                  >
                    <v-list-item-title>
                      <a :href="item.url" target="_blank">
                        Download {{ item.ext }}
                      </a>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </div>
        <a
          v-else
          href="https://play.google.com/store/apps/details?id=com.troplo.privateuploader"
        >
          <img
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            target="_blank"
            width="200"
            class="align-center text-center"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import functions from "@/plugins/functions";
import axios from "axios";
import { onMounted, ref } from "vue";

const platform = functions.getPlatform();
const downloadUrls = ref({
  Windows: [],
  Linux: [],
  Mac: [],
  Android: []
});
const defaults = {
  Windows: "exe",
  Linux: "tar.gz",
  Mac: "dmg",
  Android: "Google Play"
};
const version = ref("");

async function getVersions() {
  const { data } = await axios.get(
    "https://updates.flowinity.com/versions/sorted"
  );

  downloadUrls.value = {
    Windows: [],
    Linux: [],
    Mac: [],
    Android: []
  };

  version.value = data.items[0].name;

  for (const item of data.items[0].assets) {
    console.log(item.filetype);
    switch (item.filetype) {
      case ".msi":
      case ".exe":
        downloadUrls.value.Windows.push({
          ext: item.filetype.replace(".", ""),
          url: `https://updates.flowinity.com/download/flavor/default/${version.value}/windows_64/${item.name}`
        });
        break;
      case ".AppImage":
      case ".deb":
      case ".rpm":
        downloadUrls.value.Linux.push({
          ext: item.filetype.replace(".", ""),
          url: `https://updates.flowinity.com/download/flavor/default/${version.value}/linux_64/${item.name}`
        });
        break;
      case ".gz":
        downloadUrls.value.Linux.push({
          ext: "tar.gz",
          url: `https://updates.flowinity.com/download/flavor/default/${version.value}/linux_64/${item.name}`
        });
        break;
      case ".pkg":
      case ".dmg":
        downloadUrls.value.Mac.push({
          ext: item.filetype.replace(".", ""),
          url: `https://updates.flowinity.com/download/flavor/default/${version.value}/mac/${item.name}`
        });
        break;
      default:
        break;
    }
  }

  downloadUrls.value.Android.push({
    ext: "Google Play",
    url: `https://play.google.com/store/apps/details?id=com.troplo.privateuploader`
  });

  return data;
}

onMounted(async () => {
  await getVersions();
});
</script>

<style lang="scss" scoped>
.hero {
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
}

.hero-body {
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.hero-body .title {
  font-size: 4rem;
  font-weight: 700;
}

.mobile .title {
  font-size: 2rem;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 500;
}

.mobile .subtitle {
  font-size: 1.25rem;
}
</style>
