<template>
  <template v-if="!$app.cordova">
    <v-card-title>API Key Options</v-card-title>
    <v-select
      v-model="selected"
      :items="items"
      item-value="token"
      item-title="name"
      class="mx-3"
      placeholder="Select an API Key"
      label="Select an API Key"
    ></v-select>
    <div class="mt-n3 mx-3">
      <HoverChip
        class="mr-2 mt-2"
        color="teal"
        @click="$functions.copy(selected)"
        :disabled="!selected"
        icon="mdi-content-copy"
        text="Copy API Key"
        :old="true"
        disabled-text="Please select an API Key"
      ></HoverChip>
      <HoverChip
        class="mr-2 mt-2"
        color="indigo"
        @click="saveFile('sharex')"
        :disabled="!selected"
        icon="mdi-download"
        text="Download ShareX Config"
        :old="true"
        disabled-text="Please select an API Key"
      ></HoverChip>
      <HoverChip
        class="mr-2 mt-2"
        color="deep-purple"
        @click="saveFile('sharenix')"
        :disabled="!selected"
        icon="mdi-download"
        text="Download ShareNix Config"
        :old="true"
        disabled-text="Please select an API Key"
      ></HoverChip>
      <HoverChip
        class="mr-2 mt-2"
        color="#78C257"
        href="https://i.troplo.com/i/c9069cbd9284.flo"
        icon="mdi-android"
        text="Download Automate Config"
        :old="true"
      ></HoverChip>
      <HoverChip
        class="mr-2 mt-2"
        color="white"
        href="https://www.icloud.com/shortcuts/2d3bca05bfe94ee3ac57611b6b1e5764"
        icon="mdi-apple"
        text="Download Shortcuts Config"
        :old="true"
        target="_blank"
      ></HoverChip>
    </div>
    <v-card-title>How to install the ShareX configuration:</v-card-title>
    <v-container>
      <video controls height="430" muted>
        <source
          src="https://i.troplo.com/i/e66cb847249e.mp4"
          type="video/mp4"
        />
      </video>
    </v-container>
    <v-card-title>How to install the ShareNix configuration:</v-card-title>
    <v-container>
      <ol>
        <li>Download and install ShareNix for your distribution.</li>
        <li>
          Download and install Flameshot or another supported screenshot tool.
        </li>
        <li>Download the ShareNix config.</li>
        <li>
          Move the downloaded config to ~/.sharenix.json, example:
          <code>
            mv "{{ $user.user?.username }} - TPU.json" ~/.sharenix.json
          </code>
        </li>
        <li>
          Run
          <code>sharenix {file}</code>
          or
          <code>sharenix-section</code>
          (for a screenshot) to upload a file to TPU.
        </li>
      </ol>
    </v-container>
    <v-card-title>
      How to install the Automate config for Android devices:
    </v-card-title>
    <v-container>
      <ol>
        <li>
          Download the Automate app from the Google Play Store
          <a
            href="https://play.google.com/store/apps/details?id=com.llamalab.automate"
          >
            here.
          </a>
        </li>
        <li>Download the Automate .flo config from TPU.</li>
        <li>
          From the 3 dots on the top right hand corner, press the "Import"
          button and import the .flo file using the file manager.
        </li>
        <li>
          Select the imported TPU flow, and hit the "Edit" icon floating action
          button, and then the graph icon.
        </li>
        <li>
          Modify the 3 top block variables collectionId, apiKey, path to your
          liking, collectionId may be null, this will send an additional network
          request to add any uploads to a collection from your device.
        </li>
        <li>
          Start the flow, and enable the option to start flows at system boot in
          the app settings if you'd like.
        </li>
        <small>
          Android 12 or lower is recommended. Android 13 may display a
          notification when an item has been newly copied to the clipboard, you
          may want to disable the auto clipboard copy block in this case.
        </small>
      </ol>
    </v-container>
    <v-card-title>
      How to install the Shortcuts config for Apple iOS devices:
    </v-card-title>
    <v-container>
      <ol>
        <li>Install the configuration file via iCloud.</li>
        <li>Follow setup screen and provide your TPU API key of choice.</li>
        <li>
          Enable the ability to use the accessibility button for quick
          screenshots in Accessibility -> Touch -> Back Tap -> [Select either
          Double Tap or Triple Tap] -> Scroll down to "SHORTCUTS" -> Select TPU.
        </li>
      </ol>
    </v-container>
  </template>
  <template v-else>
    <v-card-title>TPU Mobile Options</v-card-title>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HoverChip from "@/components/Core/HoverChip.vue";

export default defineComponent({
  name: "Setup",
  components: { HoverChip },
  data() {
    return {
      selected: "",
      items: []
    };
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
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent("click", true, false);
      a.dispatchEvent(e);
    }
  },
  mounted() {
    this.getAPIKeys();
    if (this.$app.cordova) {
      console.log(window.cordova.file);
    }
  }
});
</script>

<style scoped></style>
