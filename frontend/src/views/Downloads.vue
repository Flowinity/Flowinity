<template>
  <div class="hero">
    <div :class="{ 'mx-5 mobile': $vuetify.display.mobile }" class="hero-body">
      <div class="title">
        <p class="text-6xl font-bold">Download Flowinity</p>
      </div>
      <div class="subtitle">
        <p class="text-2xl font-semibold">
          Get started with Flowinity on your device today
        </p>
      </div>
      <div class="mt-4">
        <v-btn-toggle variant="outlined" divided>
          <v-btn class="download-button" variant="tonal">
            Download for {{ platform }} ({{ version }})
          </v-btn>
          <v-btn class="download-button" variant="tonal">
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
        </v-btn-toggle>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import functions from "@/plugins/functions";
import axios from "axios";
import { onMounted, ref } from "vue";

const platform = functions.getPlatform();
const downloadUrls = {
  Windows: [],
  Linux: [
    {
      ext: "AppImage",
      url: "https://flowinity.com/download/linux"
    },
    {
      ext: "deb",
      url: "https://flowinity.com/download/linux"
    }
  ]
};
const version = ref("");
async function getVersions() {
  const { data } = await axios.get(
    "https://updates.flowinity.com/versions/sorted"
  );

  version.value = data.items[0].name;

  for (const item of data.items[0].assets) {
    if (item.filetype === "exe") {
      downloadUrls.Windows = [
        {
          ext: "exe",
          url: `https://updates.flowinity.com/download/flavor/default/${version.value}/windows_64/${item.name}.exe`
        }
      ];
    }

    if (item.filetype === "AppImage") {
      downloadUrls.Linux.push({
        ext: "AppImage",
        url: `https://updates.flowinity.com/download/flavor/default/${version.value}/linux_64/${item.name}.AppImage`
      });
    }

    if (item.filetype === "deb") {
      downloadUrls.Linux.push({
        ext: "deb",
        url: `https://updates.flowinity.com/download/flavor/default/${version.value}/linux_64/${item.name}.deb`
      });
    }
  }

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
  font-size: 2.5rem;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 500;
}

.mobile .subtitle {
  font-size: 1.25rem;
}
</style>

<style>
.sign-up-button,
.v-input__prepend,
.v-input__append {
  padding-top: 0 !important;
}
</style>
