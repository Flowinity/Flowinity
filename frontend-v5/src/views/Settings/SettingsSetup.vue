<template>
  <card padding class="my-4 mx-4">
    <strong class="ml-1">
      {{ t("settings.setup.title") }}
    </strong>
    <tpu-select
      v-model="selectedId"
      :items="items"
      :label="t('settings.setup.actions.selectAPIKey')"
    />
    <div class="flex flex-wrap mt-3 gap-2">
      <tpu-button
        class="gap-2"
        :disabled="!selected"
        color="blue"
        @click="
          toast.success(t('generic.copied'));
          functions.copy(selected?.token);
        "
      >
        <RiFileCopyLine style="width: 20px" />
        {{ t("settings.setup.actions.copy") }}
      </tpu-button>
      <tpu-button
        v-if="platform === 'microsoftWindows'"
        class="gap-2"
        :disabled="!selected"
        color="teal"
        @click="saveFile('sharex')"
      >
        <RiDownloadLine style="width: 20px" />
        {{ t("settings.setup.actions.downloadShareX") }}
      </tpu-button>
      <tpu-button
        v-if="platform === 'linux'"
        class="gap-2"
        :disabled="!selected"
        color="purple"
        @click="saveFile('sharenix')"
      >
        <RiDownloadLine style="width: 20px" />
        {{ t("settings.setup.actions.downloadShareNix") }}
      </tpu-button>
      <tpu-button
        v-if="platform === 'android'"
        class="gap-2"
        :disabled="!selected"
        color="green"
        @click="
          toast.success(t('generic.copied'));
          functions.copy(selected?.token);
        "
      >
        <RiAndroidLine style="width: 20px" />
        {{ t("settings.setup.actions.downloadAutomate") }}
      </tpu-button>
      <div
        class="flex w-full flex-wrap items-center justify-between ml-1 my-2 mx-4"
      >
        <strong v-if="platform === 'linux'">
          {{ t("settings.setup.linux.title") }}
        </strong>
        <strong v-else-if="platform === 'microsoftWindows'">
          {{ t("settings.setup.microsoftWindows.title") }}
        </strong>
        <strong v-else-if="platform === 'android'">
          {{ t("settings.setup.android.title") }}
        </strong>
        <strong v-else-if="platform === 'otherPlatform'">
          {{ t("settings.setup.otherPlatform.title") }}
        </strong>
        <tpu-select
          v-model="platform"
          :items="platforms"
          :label="t('settings.setup.actions.selectPlatform')"
          style="height: 35px"
        ></tpu-select>
      </div>
      <div v-if="platform === 'linux'"></div>
      <div v-else-if="platform === 'microsoftWindows'">
        <p class="mb-4 -mt-2 ml-1">
          Setting up {{ appStore.state?.name }} on Microsoft Windows is easy! Follow the
          video below to get started.
        </p>
        <video controls="" height="430" width="800">
          <source
            src="https://i.troplo.com/i/e66cb847249e.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div v-if="platform === 'otherPlatform'">
        <p class="mb-4 -mt-2 ml-1">
          Here are the following information you may need to create a custom
          implementation using the API:
        </p>
        <strong>Single file:</strong>
        <ol>
          <li>
            Request:
            <code>
              POST {{ appStore.state?.hostnameWithProtocol }}/api/v3/gallery
            </code>
          </li>
          <li>
            Data:
            <code>multipart/form-data</code>
          </li>
          <li>
            Fields:
            <code>attachment: File</code>
          </li>
          <li>
            Headers:
            <code>Authorization: API Key</code>
          </li>
        </ol>
        <strong class="mt-2">Multiple files:</strong>
        <ol>
          <li>
            Request:
            <code>
              POST
              {{ appStore.state?.hostnameWithProtocol }}/api/v3/gallery/site
            </code>
          </li>
          <li>
            Data:
            <code>multipart/form-data</code>
          </li>
          <li>
            Fields:
            <code>attachments: File[]</code>
          </li>
          <li>
            Headers:
            <code>Authorization: API Key</code>
          </li>
        </ol>
      </div>
    </div>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import { useI18n } from "vue-i18n";
import { Session, SessionType } from "@/gql/graphql";
import TpuSelect from "@/components/Framework/Input/TpuSelect.vue";
import { computed, onMounted, ref } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { SessionsQuery } from "@/graphql/user/sessions.graphql";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiFileCopyLine from "vue-remix-icons/icons/ri-file-copy-line.vue";
import RiDownloadLine from "vue-remix-icons/icons/ri-download-line.vue";
import RiAndroidLine from "vue-remix-icons/icons/ri-android-line.vue";
import functions from "@/plugins/functions";
import { useToast } from "vue-toastification";
import { useAppStore } from "@/stores/app.store";
import { useUserStore } from "@/stores/user.store";

const { t } = useI18n();
const toast = useToast();
const selectedId = ref(0);
const items = ref<Session[]>([]);
const selected = computed(() => {
  return items.value.find((item) => item.id === selectedId.value);
});
const platform = ref("linux");
const platforms = [
  {
    name: "Linux",
    id: "linux"
  },
  {
    name: "Microsoft Windows",
    id: "microsoftWindows"
  },
  {
    name: "Android",
    id: "android"
  },
  {
    name: "Other Platform",
    id: "otherPlatform"
  }
];
const appStore = useAppStore();
const userStore = useUserStore();

async function getAPIKeys() {
  const {
    data: {
      currentUser: { sessions }
    }
  } = await useApolloClient().client.query({
    query: SessionsQuery,
    variables: {
      input: {
        type: SessionType.Api
      }
    }
  });
  items.value = sessions;
}

function config() {
  return {
    Version: "13.5.0",
    Name: appStore.state?.name,
    DestinationType: "ImageUploader, TextUploader, FileUploader",
    RequestURL: appStore.state?.hostnameWithProtocol + "/api/v3/gallery",
    Body: "MultipartFormData",
    Headers: {
      Authorization: selected.value?.token
    },
    FileFormName: "attachment",
    URL: "$json:url$",
    RequestMethod: "POST",
    RequestType: "POST"
  };
}

function saveFile(type: "sharex" | "sharenix" = "sharex") {
  let data;
  if (type === "sharex") {
    data = JSON.stringify(this.config(type));
  } else {
    data = JSON.stringify({
      DefaultFileUploader: appStore.state?.name,
      DefaultImageUploader: appStore.state?.name,

      Services: [this.config(type)]
    });
  }

  const blob = new Blob([data], { type: "text/plain" });
  const e = document.createEvent("MouseEvents"),
    a = document.createElement("a");
  const ext = type === "sharex" ? ".sxcu" : ".json";
  a.download = userStore.user?.username + " - " + appStore.state?.name + ext;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
  e.initEvent("click", true, false);
  a.dispatchEvent(e);
}

onMounted(() => {
  getAPIKeys();
  if (window.navigator.userAgent.toLowerCase().includes("microsoftWindows")) {
    platform.value = "microsoftWindows";
  } else if (window.navigator.userAgent.toLowerCase().includes("android")) {
    platform.value = "android";
  }
});
</script>

<style scoped></style>
