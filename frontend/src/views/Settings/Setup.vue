<template>
  <template v-if="!$app.cordova">
    <a href="https://github.com/Flowinity/Flameshot" target="_blank">
      <v-alert variant="tonal" color="blue">
        <div class="d-flex align-center">
          <v-chip>NEW</v-chip>
          <div class="ml-2 justify-space-between d-flex">
            {{ $t("settings.setup.flowinityFlameshot") }}
          </div>
        </div>
      </v-alert>
    </a>
    <v-card-title class="d-flex justify-space-between align-center mt-n5">
      <div>{{ $t("settings.setup.title") }}</div>
      <v-select
        v-model="platform"
        :items="['Windows', 'Mac', 'Linux', 'Android', 'iOS']"
        placeholder="Select"
        class="mx-3"
        dense
        style="max-width: 150px; margin-top: 10px"
      ></v-select>
    </v-card-title>
    <v-select
      v-model="selected"
      :items="items"
      :label="$t('settings.setup.label')"
      :placeholder="$t('settings.setup.label')"
      class="mx-3"
      item-title="name"
      item-value="token"
    />
    <div class="mt-n3 mx-3">
      <HoverChip
        v-if="platform === 'Linux' || platform === 'Mac'"
        :disabled-text="$t('settings.setup.label')"
        :old="true"
        :text="$t('settings.setup.actions.getFlowshot')"
        class="mr-2 mt-2"
        color="primary"
        icon="mdi-download"
        target="_blank"
        href="https://github.com/Flowinity/Flameshot/releases"
      />
      <HoverChip
        :disabled="!selected"
        :disabled-text="$t('settings.setup.label')"
        :old="true"
        :text="$t('settings.setup.actions.apiKey')"
        class="mr-2 mt-2"
        color="teal"
        icon="mdi-content-copy"
        @click="$functions.copy(selected)"
      />
      <HoverChip
        :disabled="!selected"
        :disabled-text="$t('settings.setup.label')"
        :old="true"
        :text="$t('settings.setup.actions.sharex')"
        class="mr-2 mt-2"
        color="indigo"
        icon="mdi-download"
        @click="saveFile('sharex')"
      />
      <HoverChip
        :disabled="!selected"
        :disabled-text="$t('settings.setup.label')"
        :old="true"
        :text="$t('settings.setup.actions.sharenix')"
        class="mr-2 mt-2"
        color="deep-purple"
        icon="mdi-download"
        @click="saveFile('sharenix')"
      />
      <HoverChip
        :old="true"
        :text="$t('settings.setup.actions.automate')"
        class="mr-2 mt-2"
        color="#78C257"
        href="https://i.troplo.com/i/c9069cbd9284.flo"
        icon="mdi-android"
      />
      <HoverChip
        :old="true"
        :text="$t('settings.setup.actions.shortcuts')"
        class="mr-2 mt-2"
        color="white"
        href="https://www.icloud.com/shortcuts/2d3bca05bfe94ee3ac57611b6b1e5764"
        icon="mdi-apple"
        target="_blank"
      />
    </div>
    <template v-if="platform === 'Windows'">
      <v-card-title>
        {{ $t("settings.setup.sharex") }}
      </v-card-title>
      <v-container>
        <video controls height="430" muted>
          <source
            src="https://i.troplo.com/i/e66cb847249e.mp4"
            type="video/mp4"
          />
        </video>
      </v-container>
    </template>
    <template v-if="platform === 'Windows' || platform === 'Mac'">
      <v-alert color="red" variant="tonal" class="mx-4 my-4">
        Flowshot has not been tested on Windows or Mac. It's only officially
        supported on Linux. You will need to compile it yourself from
        <a href="https://github.com/Flowinity/flameshot">here</a>
        if you want to use it.
      </v-alert>
    </template>
    <template v-if="platform === 'Linux' || platform === 'Mac'">
      <v-card-title>
        {{ $t("settings.setup.flowshot") }}
      </v-card-title>
      <v-container>
        <ol>
          <li v-html="$t('settings.setup.flowshotSteps.1')"></li>
          <li v-html="$t('settings.setup.flowshotSteps.2')"></li>
          <li>{{ $t("settings.setup.flowshotSteps.3") }}</li>
          <li>
            {{ $t("settings.setup.flowshotSteps.4") }}
          </li>
          <li v-html="$t('settings.setup.flowshotSteps.5')"></li>
          <li v-html="$t('settings.setup.flowshotSteps.6')"></li>
        </ol>
      </v-container>
    </template>
    <template v-if="platform === 'Linux'">
      <v-card-title>
        {{ $t("settings.setup.sharenix") }}
      </v-card-title>
      <v-container>
        <ol>
          <li>
            {{ $t("settings.setup.sharenixSteps.1") }}
          </li>
          <li>
            {{ $t("settings.setup.sharenixSteps.2") }}
          </li>
          <li>{{ $t("settings.setup.sharenixSteps.3") }}</li>
          <li>
            {{ $t("settings.setup.sharenixSteps.4") }}
            <code>
              mv "{{ $user.user?.username }} - {{ $app.site.name }}.json"
              ~/.sharenix.json
            </code>
          </li>
          <li v-html="$t('settings.setup.sharenixSteps.5')"></li>
        </ol>
      </v-container>
    </template>
    <template v-if="platform === 'Android'">
      <v-card-title>
        {{ $t("settings.setup.automate") }}
      </v-card-title>
      <v-container>
        <ol>
          <li v-html="$t('settings.setup.automateSteps.1')"></li>
          <li>
            {{ $t("settings.setup.automateSteps.2") }}
          </li>
          <li>
            {{ $t("settings.setup.automateSteps.3") }}
          </li>
          <li>
            {{ $t("settings.setup.automateSteps.4") }}
          </li>
          <li>
            {{ $t("settings.setup.automateSteps.5") }}
          </li>
          <li>
            {{ $t("settings.setup.automateSteps.6") }}
          </li>
          <small>
            {{ $t("settings.setup.automateSteps.7") }}
          </small>
        </ol>
      </v-container>
    </template>
    <template v-if="platform === 'iOS'">
      <v-card-title>
        {{ $t("settings.setup.shortcuts") }}
      </v-card-title>
      <v-container>
        <ol>
          <li>
            {{ $t("settings.setup.shortcutsSteps.1") }}
          </li>
          <li>
            {{ $t("settings.setup.shortcutsSteps.2") }}
          </li>
          <li>
            {{ $t("settings.setup.shortcutsSteps.3") }}
          </li>
        </ol>
      </v-container>
    </template>
  </template>
  <template v-else>
    <v-card-title>
      {{ $t("settings.setup.title") }}
    </v-card-title>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HoverChip from "@/components/Core/HoverChip.vue";
import functions from "@/plugins/functions";

export default defineComponent({
  components: { HoverChip },
  data() {
    return {
      selected: "",
      items: [],
      platform: "Windows"
    };
  },
  mounted() {
    this.getAPIKeys();
    if (this.$app.cordova) {
      console.log(window.cordova.file);
    }
    this.platform = functions.getPlatform();
  },
  methods: {
    config(type: "sharex" | "sharenix" = "sharex") {
      let data = {
        Version: "13.5.0",
        Name: this.$app.site.name,
        DestinationType: "ImageUploader, TextUploader, FileUploader",
        RequestURL:
          this.$app.site.hostnameWithProtocol +
          "/api/" +
          this.$app.apiVersion +
          "/gallery",
        Body: "MultipartFormData",
        Headers: {
          Authorization: this.selected
        },
        FileFormName: "attachment",
        URL: "$json:url$"
      } as {
        Version: string;
        Name: string;
        DestinationType: string;
        RequestURL: string;
        Body: string;
        Headers: {
          Authorization: string;
        };
        FileFormName: string;
        URL: string;
        RequestMethod?: string;
        RequestType?: string;
      };
      if (type === "sharenix") {
        data.RequestType = "POST";
      } else {
        data.RequestMethod = "POST";
      }
      return data;
    },
    async getAPIKeys() {
      const { data } = await this.axios.get("/security/keys");
      this.items = data;
    },
    saveFile(type: "sharex" | "sharenix" = "sharex") {
      console.log(2);
      let data = null;
      if (type === "sharex") {
        data = JSON.stringify(this.config(type));
      } else {
        data = JSON.stringify({
          DefaultFileUploader: this.$app.site.name,
          DefaultImageUploader: this.$app.site.name,

          Services: [this.config(type)]
        });
      }
      const blob = new Blob([data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      const ext = type === "sharex" ? ".sxcu" : ".json";
      a.download =
        this.$user.user?.username + " - " + this.$app.site.name + ext;
      //@ts-ignore
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent("click", true, false);
      a.dispatchEvent(e);
    }
  }
});
</script>
<script setup lang="ts"></script>
<script setup lang="ts"></script>
<script setup lang="ts"></script>
